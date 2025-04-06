import { ArnFormat, Stack, StackProps } from "aws-cdk-lib";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import {
  OpenIdConnectProvider,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from "aws-cdk-lib/aws-iam";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

const gitHubOrg = "jas7553";
const gitHubRepo = "wizard-scorecard";

interface DeploymentInfrastructureStackProps extends StackProps {
  deploymentStackName: string;
  distribution: IDistribution;
  websiteBucket: IBucket;
}

export class DeploymentInfrastructureStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: DeploymentInfrastructureStackProps,
  ) {
    super(scope, id, props);

    const openIdConnectProvider =
      OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        "GitHubOIDCProvider",
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
      );

    const role = new Role(this, "GitHubActionsRole", {
      assumedBy: new WebIdentityPrincipal(
        openIdConnectProvider.openIdConnectProviderArn,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${gitHubOrg}/${gitHubRepo}:*`,
          },
        },
      ),
      description: "IAM role for GitHub Actions to deploy via CDK",
      roleName: "GitHubActionsCDKDeployRole",
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "cloudformation:CreateChangeSet",
          "cloudformation:CreateStack",
          "cloudformation:DeleteChangeSet",
          "cloudformation:DeleteStack",
          "cloudformation:DescribeChangeSet",
          "cloudformation:DescribeStackEvents",
          "cloudformation:DescribeStacks",
          "cloudformation:ExecuteChangeSet",
          "cloudformation:GetTemplate",
          "cloudformation:SetStackPolicy",
          "cloudformation:UpdateStack",
          "cloudformation:ValidateTemplate",
        ],
        resources: [
          this.formatArn({
            service: "cloudformation",
            resource: "stack",
            resourceName: `${props.deploymentStackName}/*`,
            arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
          }),
        ],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
        ],
        resources: [
          props.websiteBucket.bucketArn,
          `${props.websiteBucket.bucketArn}/*`,
        ],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetDistribution",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations",
        ],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${props.distribution.distributionId}`,
        ],
      }),
    );
  }
}
