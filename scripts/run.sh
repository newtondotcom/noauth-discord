#!/bin/bash

# Check if enough arguments are provided
if [ $# -lt 1 ]; then
    echo "Usage: $0 <input_file>"
    exit 1
fi

# Input file containing a list of names and ports
input_file="$1"

# Specify the image name and tag
image_name="newtondotcom/noauthdiscord"
image_tag="latest-arm64"

# Pull the latest image
docker pull "$image_name:$image_tag"

temp_dir=$(mktemp -d)

docker stop $(docker ps -a -q --filter "ancestor=$image_name:$image_tag")
docker rm $(docker ps -a -q --filter "ancestor=$image_name:$image_tag")

# Read the input file line by line, ignoring Windows line endings
while IFS= read -r line || [[ -n "$line" ]]; do
    line=$(echo "$line" | tr -d '\r')  # Remove Windows carriage returns if present
    IFS=',' read -ra parts <<< "$line"
    if [ "${#parts[@]}" -eq 2 ]; then
        container_name="${parts[0]}"
        port_to_expose="${parts[1]}"

        # Docker create command with port exposure
        docker_create_command="docker create --name $container_name -p $port_to_expose:5000 $image_name:$image_tag"

        # Print and execute the Docker create command
        echo "Creating Docker container for $container_name:"
        eval "$docker_create_command"

        cp scripts/generateConstants.js "$temp_dir/generateConstants.js"
        sed -i '' "s/let botname = \"test\";/let botname = \"$container_name\";/" "$temp_dir/generateConstants.js"

        # Copy the generateConstants.js file into the container
        docker cp "$temp_dir/generateConstants.js" "$container_name:/usr/src/bot/generateConstants.js"

        # Start the container
        docker start "$container_name"
    fi
done < "$input_file"
