import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CfnOIDCProvider,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from "aws-cdk-lib/aws-iam";

const gitHubRepoName = "jas7553/wizard-scorecard";

export class DeploymentInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const gitHubOidcProvider = new CfnOIDCProvider(this, "GitHubOidcProvider", {
      clientIdList: ["sts.amazonaws.com"],
      url: "https://token.actions.githubusercontent.com",
    });

    const role = new Role(this, "GitHubActionsRole", {
      assumedBy: new WebIdentityPrincipal(
        gitHubOidcProvider.attrArn,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${gitHubRepoName}:*`,
          },
        },
      ),
      description: "IAM role for GitHub Actions to deploy via CDK",
      roleName: "GitHubActionsCDKDeployRole",
    });

    const bootstrapQualifier =
      this.node.tryGetContext("bootstrapQualifier") ?? "hnb659fds";

    role.addToPolicy(
      new PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [
          `arn:aws:iam::${Stack.of(this).account}:role/cdk-${bootstrapQualifier}-cfn-exec-role-${Stack.of(this).account}-${Stack.of(this).region}`,
          `arn:aws:iam::${Stack.of(this).account}:role/cdk-${bootstrapQualifier}-deploy-role-${Stack.of(this).account}-${Stack.of(this).region}`,
          `arn:aws:iam::${Stack.of(this).account}:role/cdk-${bootstrapQualifier}-file-publishing-role-${Stack.of(this).account}-${Stack.of(this).region}`,
          `arn:aws:iam::${Stack.of(this).account}:role/cdk-${bootstrapQualifier}-lookup-role-${Stack.of(this).account}-${Stack.of(this).region}`,
        ],
      }),
    );
  }
}
