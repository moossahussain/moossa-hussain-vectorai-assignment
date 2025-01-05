import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, SubnetType, IpAddresses, SecurityGroup, Peer, Port, InstanceType, InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';
import * as docdb from 'aws-cdk-lib/aws-docdb';

export class DatabaseStack extends cdk.Stack {
    public readonly databaseVpc: Vpc; // Expose VPC as a public property
    public readonly databaseSecurityGroup: SecurityGroup; // Expose Security Group as a public property
    public readonly cluster: docdb.DatabaseCluster; // Expose DocumentDB Cluster as a public property

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a VPC with public and private subnets
        this.databaseVpc = new Vpc(this, 'DatabaseVpc', {
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: 2, // Limit to 2 Availability Zones for cost control
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    name: 'DatabasePublicSubnet',
                    cidrMask: 24,
                },
                {
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                    name: 'DatabasePrivateSubnet',
                    cidrMask: 24,
                },
            ],
        });

        // Create a security group for the database
        this.databaseSecurityGroup = new SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: this.databaseVpc,
            securityGroupName: 'DatabaseSG',
            description: 'Security group for database allowing SSH, HTTP, HTTPS access',
            allowAllOutbound: true, // Allow all outbound traffic
        });
        //Allowed all access for testing purpose, not production ready yet.
            // Allow SSH (port 22) - for administrative access
        this.databaseSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'Allow SSH access');

        // Allow HTTP (port 80) - for web access
        this.databaseSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow HTTP access');

        // Allow HTTPS (port 443) - for secure web access
        this.databaseSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow HTTPS access');

        // Allow HTTPS (port 27017) - for secure mongo access
        this.databaseSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(27017), 'Allow mongo access');

        //Needs more debugging here
            // Create DocumentDB Cluster
        this.cluster = new docdb.DatabaseCluster(this, 'DocumentDBCluster', {
            masterUser: {
            username: 'dbAdmin', // secure username
            password: cdk.SecretValue.unsafePlainText('adminadmin'), // secure password
            },
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
            vpc: this.databaseVpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
              },
              securityGroup: this.databaseSecurityGroup
        });
        this.cluster.connections.allowDefaultPortFromAnyIpv4('Wide open');

        // Output the VPC ID
        new cdk.CfnOutput(this, 'DatabaseVpcId', {
            value: this.databaseVpc.vpcId,
        });

        // Output the Security Group ID
        new cdk.CfnOutput(this, 'DatabaseSecurityGroupId', {
            value: this.databaseSecurityGroup.securityGroupId,
        });

        // Output the cluster endpoint
        new cdk.CfnOutput(this, 'DocumentDBEndpoint', {
            value: this.cluster.clusterEndpoint.socketAddress,
        });
    }
}
