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

If you don't want to use all the fancy features of Fosterkit and you just need to do some quick backend changes, then:

```
vagrant up
```

to start the PHP server and open the project in your browser at: [project-local-url.dev](project-local-url.dev).

For more details about Fosterkit read the [documentation](https://github.com/CosminAnca/fosterkit/).

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
