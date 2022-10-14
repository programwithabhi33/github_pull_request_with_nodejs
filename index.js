const { GraphQLClient } = require('graphql-request');

const token = process.env.GITHUB_GQL_TOKEN;

async function main() {
  console.log(token);
  const endpoint = 'https://api.github.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const query = /* GraphQL */ `
    {
      repository(owner: "programwithabhi33", name: "php_oops") {
        pullRequests(first: 1, states: [OPEN]) {
          nodes {
            id
            number
            changedFiles
            deletions
            mergeable
            author {
              url
            }
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);

  console.log(JSON.stringify(data, undefined, 2));

//   Id is the pull request id you can gave here
  const id = 'some-pull-request-id';

 const mutation = /* GraphQL */ `
      mutation mergePullRequest($input: MergePullRequestInput!) {
        mergePullRequest(input: $input) {
          pullRequest {
            merged
            mergedAt
            state
            url
          }
        }
      }
    `;

    const variables = {
      input: {
        pullRequestId: id
      }
    };

    const { mergePullRequest } = await graphQLClient.request(mutation, variables);

    console.log(`merged ${mergePullRequest.pullRequest.url}`);

}

main();
