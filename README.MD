# Cash Envelope

#### A simple app for keeping track of finances through virtual cash envelopes

## Links

[Demo](https://expo.io/@samscha/cash-envelope-native)

[Server (GitHub)](https://github.com/samscha/cash-envelope)

## Install

To install and run the app locally:

```console
npm install -g expo-cli
```

or

```console
yarn global add expo-cli
```

then

```console
cd /path/to/cash-react-native && expo start
```

Caveats:

- either Simulator (Xcode) or Emulator (Android Studio) can be used
- physical mobile phone via LAN can also be used

## `TODO`s

- [ ] Create a list of transactions for each envelope in `features`
- [ ] Create a system for easily adding transactions
- [ ] Add server logic for addiing transactions for a specific envelope
- [ ] Add 'No Envelopes' text when there are no envelopes

## Known bugs

- [ ] The 'Update envelope' button does not hide when the envelope state
      is the same as the server version
- [ ] The login page has some bugs with error checking for allowing login
- [ ] Session expiration does not log out the user if on `EnvelopesScreen`
