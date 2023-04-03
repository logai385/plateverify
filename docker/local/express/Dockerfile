# Set a build-time argument with a default value
ARG NODE_VERSION=18-alpine3.16

# Use the specified Node.js image as the base image
FROM node:${NODE_VERSION}

# Set metadata for the Docker image
LABEL name="plateverify"
LABEL license="MIT"
LABEL description="plate verify image"

# Set an environment variable
ENV NODE_ENV=development

# Set a build-time argument with a default value
ARG APP_HOME=/app

# Set the working directory of the container
WORKDIR ${APP_HOME}

# Create a system group and user for the container
RUN addgroup --system bus \
    && adduser --system --ingroup bus bus

# Copy package.json and package-lock.json to the current directory and run npm install
COPY package*.json ./
RUN npm install

# Copy the rest of the application files to the APP_HOME directory and set ownership
COPY --chown=bus:bus . ${APP_HOME}
RUN chown bus:bus ${APP_HOME}

# Set the user to the invoice user and run the default command
USER bus
CMD ["npm", "run", "dev"]
