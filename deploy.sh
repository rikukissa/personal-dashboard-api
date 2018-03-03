playswarm image:push -i futurice/personal-dashboard -t $(git rev-parse --short HEAD) &&
playswarm app:deploy -i futurice/personal-dashboard -t $(git rev-parse --short HEAD) -n personal-dashboard