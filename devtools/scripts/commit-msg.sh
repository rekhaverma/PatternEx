#!/usr/bin/env ruby
message_file = ARGV[0]
message = File.read(message_file)

$regex = /\[(BYUI-|RS-)(\d+)\]/

if !$regex.match(message)
  puts "[ERROR] Your message is missing JIRA issue tag"
  exit 1
end
