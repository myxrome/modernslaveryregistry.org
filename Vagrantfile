# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure('2') do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = 'bento/ubuntu-16.04'

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  config.vm.network 'forwarded_port', guest: 9292, host: 9292, host_ip: '127.0.0.1'

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network 'private_network', ip: '192.168.33.10'

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder '.', '/vagrant', nfs: true

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider 'virtualbox' do |vb|
    #   # Display the VirtualBox GUI when booting the machine
    #   vb.gui = true
    #
    #   # Customize the amount of memory on the VM:
    vb.memory = '4096'
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Forward my SSH key so that I can clone from GitHub
  config.ssh.forward_agent = true

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision 'shell', inline: <<-SHELL
    # Add package for Ruby 2.4
    add-apt-repository ppa:brightbox/ruby-ng

    # Add package for Postgresql 9.6
    add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main"
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

    apt-get update

    # Install ImageMagick to resize image snapshots stored in database
    apt-get install -y imagemagick

    # Install Ruby 2.4, update Rubygems and install Bundler
    apt-get install -y ruby2.4 ruby2.4-dev
    gem update --system
    gem install bundler

    # Install foreman for running the web server and worker
    gem install foreman

    # Required by wkhtmltoimage
    apt-get install -y libxrender1
    apt-get install -y libfontconfig1
    apt-get install -y libxext6

    # Update locale in preparation for installing postgresql
    update-locale LANG=en_US.UTF-8

    # postgresql and development headers
    apt-get install -y postgresql-9.6
    apt-get install -y libpqxx-dev

    # Create postgresql user and database
    sudo -H -u postgres bash -c 'createuser vagrant --superuser'
    sudo -H -u postgres bash -c 'createdb vagrant'

    # Redis for Sidekiq
    apt-get install -y redis-server

    # JavaScript runtime for ExecJS
    apt-get install -y nodejs

    # Docsplit dependencies
    apt-get install -y graphicsmagick
    apt-get install -y poppler-utils poppler-data
    apt-get install -y ghostscript
    apt-get install -y tesseract-ocr

    # Set environment variable to allow me to detect whether I'm in the dev-vm
    echo "export RUNNING_IN_VAGRANT=true" > /etc/profile.d/env-vars.sh
  SHELL
end
