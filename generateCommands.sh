#!/bin/bash

# Check if enough arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <container_name> <port_to_expose>"
    exit 1
fi

# Arguments for the container name and port to expose
container_name="$1"
port_to_expose="$2"

# Create a text file to store the commands
commands_file="docker_commands.txt"
echo "# Docker Commands" > "$commands_file"

# Specify the image name and tag
image_name="newtondotcom/noauthdiscord"
image_tag="latest"

# Generate and save the Docker run command with port exposure
docker_run_command="docker run -d --name $container_name -p $port_to_expose:5000 $image_name:$image_tag"
echo "$docker_run_command" >> "$commands_file"

# Generate and save the sed command to replace the string
sed_command="docker exec -i $container_name bash -c 'sed -i \"s/let botname = \\"test\\";/let botname = \\"$container_name\\";/\" /generateConstants.js'"
echo "$sed_command" >> "$commands_file"