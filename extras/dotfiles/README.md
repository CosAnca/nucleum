# Project name

Built with [Nucleum](https://github.com/CosAnca/nucleum/).

### Dependencies
* Front-end stack
  * [yarn]
* WordPress (assuming you already have [Vagrant] and [VirtualBox])
  * [Vagrant HostsUpdater] (`vagrant plugin install vagrant-hostsupdater`)

[yarn]: https://yarnpkg.com/lang/en/
[Vagrant]: https://www.vagrantup.com/
[VirtualBox]: https://www.virtualbox.org/wiki/Downloads
[Vagrant HostsUpdater]: https://github.com/cogitatio/vagrant-hostsupdater

### To get started:
```zsh
git clone [project-repository]
vagrant up
```

Now you can view the website in your browser at: [http://localurl.test](http://localurl.test).

To run the front-end development task, which starts compiling, watching,
and live updating all our files as we change them, you need to:

```zsh
yarn install
yarn run nucleum
```

This will proxy the Vagrant machine through BrowserSync and also watches for any
changes made to the PHP files as well.

For more details about Nucleum read the [documentation](https://github.com/CosAnca/nucleum/).

### Contributing
1. Make your changes in a topic branch.
2. Squash your commits into a single one.
3. Rebase against `origin/master`, push and create a pull request.

#### Git messages
Your Git messages must follow this simple format:

- Capitalize your commit messages.
- Start your message with a verb.
- Use present tense.
- If case, refer to the issue/PR number in your squashed commit message.

E.g: `Create dropdown menu functionality` not `dropdown menu` or `create dropdown functionality`.
