server "ld4p-loc-bfe-dev.stanford.edu", user: "#{fetch(:user)}", roles: %w{app db web}

# allow ssh to host
Capistrano::OneTimeKey.generate_one_time_key!
