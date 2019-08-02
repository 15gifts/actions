FROM debian:jessie-slim

# docker build -t vanessa/pull-request-action .

LABEL "com.github.actions.name"="Pull Request on Branch Push"
LABEL "com.github.actions.description"="Create a pull request when a branch is created or updated"
LABEL "com.github.actions.icon"="activity"
LABEL "com.github.actions.color"="yellow"

RUN apt-get update && apt-get install -y jq curl wget git
COPY raise-pr.sh /raise-pr.sh

RUN chmod u+x /raise-pr.sh
ENTRYPOINT ["/raise-pr.sh"]
