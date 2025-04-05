import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { AccessLevel, CfnDistribution, Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { CfnOriginAccessControl } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

const domainName = "wizardscorecard.com";
const siteCertificateArn =
  "arn:aws:acm:us-east-1:890396755250:certificate/3244876a-bb67-4f9c-86e7-b6413e00f75c";

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, "WebsiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Origin Access Control
    const originAccessControl = new CfnOriginAccessControl(this, "OAC", {
      originAccessControlConfig: {
        name: "WebsiteOAC",
        description: "Access control for CloudFront to S3",
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    });

    // Create high-level Distribution with S3BucketOrigin
    const distribution = new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      domainNames: [`www.${domainName}`, domainName],
      certificate: Certificate.fromCertificateArn(
        this,
        "SiteCert",
        siteCertificateArn,
      ),
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(websiteBucket, {
          originAccessLevels: [AccessLevel.READ],
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
      ],
    });

    // Patch in OAC to the underlying L1 CloudFront distribution
    const cfnDist = distribution.node.defaultChild as CfnDistribution;
    cfnDist.addOverride(
      "Properties.DistributionConfig.Origins.0.OriginAccessControlId",
      originAccessControl.ref,
    );
    cfnDist.addOverride(
      "Properties.DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity",
      "",
    );

    // Allow CloudFront to read from the S3 bucket
    websiteBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [websiteBucket.arnForObjects("*")],
        principals: [new ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          },
        },
      }),
    );

    // Deploy website contents to the bucket
    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("../dist")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Route 53 DNS setup
    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });

    new ARecord(this, "RootAlias", {
      zone: hostedZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    new ARecord(this, "WwwAlias", {
      zone: hostedZone,
      recordName: `www.${domainName}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    // Output the website URL
    new CfnOutput(this, "WebsiteURL", {
      value: `https://${domainName}`,
    });
  }
}
