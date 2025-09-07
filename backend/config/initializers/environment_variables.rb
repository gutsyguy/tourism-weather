# Load environment variables from YAML file if it exists
env_file = Rails.root.join('config', 'environment_variables.yml')

if File.exist?(env_file)
  env_vars = YAML.load_file(env_file)[Rails.env]
  
  if env_vars
    env_vars.each do |key, value|
      ENV[key] ||= value.to_s
    end
  end
end
