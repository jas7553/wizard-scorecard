#!/usr/bin/env node
import { App } from "aws-cdk-lib";

import { DeploymentInfrastructureStack } from "../lib/deployment-infrastructure-stack";
import { WebsiteStack } from "../lib/website-stack";

const app = new App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new WebsiteStack(app, "WizardWebsiteStack", {
  env,
});

new DeploymentInfrastructureStack(app, "DeploymentInfrastructureStack", {
  env,
});
