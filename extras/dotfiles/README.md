# Project name

Built with [Fosterkit](https://github.com/CosminAnca/fosterkit/).

### Dependencies
* Front-end stack
  * [yarn]
* Wordpress (assuming you already have [Vagrant] and [Virtualbox])
  * [Vagrant Hostsupdater] (`vagrant plugin install vagrant-hostsupdater`)

[yarn]: https://yarnpkg.com/lang/en/
[Vagrant]: https://www.vagrantup.com/
[Virtualbox]: https://www.virtualbox.org/wiki/Downloads
[Vagrant Hostsupdater]: https://github.com/cogitatio/vagrant-hostsupdater

### To get started:
```zsh
git clone [project repo url]
yarn install
yarn run fosterkit
```

For more details about Fosterkit read the [documentation](https://github.com/CosminAnca/fosterkit/) provided on its Github repo.

### Contributing
1. Make your changes in a topic branch.
2. Squash your commits into a single one.
3. Rebase against `origin/master`, push and create a pull request.

  #### Git messages
  Your Git messages must follow this simple format:

  - Capitalise your commit messages.
  - Start your message with a verb.
  - Use present tense.
  - If case, refer to the issue/PR number in your squashed commit message.

E.g: `Create dropdown menu functionality` not `dropdown menu` or `create dropdown functionality`.
