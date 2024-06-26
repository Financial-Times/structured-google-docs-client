# structured-google-docs-client

A client library for fetching and transforming markup from Google Documents

## Installation

`npm install @financial-times/structured-google-docs-client`

## Usage

```js
import structuredGoogleDoc from '@financial-times/structured-google-docs-client'; // or const structuredGoogleDoc = require('structured-google-docs-client');

const content = await structuredGoogleDoc(googleDocId, { transform: transformationFunction });
```

You will need to add a file named `.env` to your project folder with the following secret variables (generate these from when you create a [service account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount) with authorized access to the Google Drive API):

- PRIVATE_KEY_ID
- PRIVATE_KEY (private key needs to be base 64 encoded)
- CLIENT_ID
- CLIENT_EMAIL_IMPERSONATE

Do NOT add this file to version control.

## Structuring your Google Doc

You should share your document with the account specified in your `.env` file.

Links, text formatting and headings will carry over into the returned markup.

Anything in the document after the characters `######` (6 hash symbols) at the start of a paragraph will not be returned.

To take advantage of the transform feature (a function to transform the pattern `[[[ contentReference ]]] [[ annotation | label]]` into custom markup):

- Wrap the `contentReference` in three square brackets [[[bit of document]]].
- Follow that with an `annotation` wrapped in two square brackets [[annotation]]
- The `label` gets added at the end, separated from the annotation by a pipe | character.

Example:

```
[[[We, the citizens of America are now joined in a great national effort to rebuild our country and to restore its promise for all of our people.]]] [[Inaugurals in the past have tended to start with a call for unity. President Trump does that again here with his vow to "restore promise for all".|Author Name]]
```

You can also include markup directly into your Google Doc by wrapping your markup between two sets of ` ``` ` symbols.

Example:

````

Normal text goes here.

```
<div id="square"></div>

```  

Other normal text goes here.

````

## API

### structuredGoogleDoc(googleDocId, [options])

Fetches the HTML of a Google Doc and returns a promise

#### googleDocId
String (required). A valid Google Doc ID

#### `options`

Plain object (optional).

- `transform`: A function that takes in three arguments (`contentReference`, `annotation`, `label`) and returns a string. To use this feature, you should wrap your text in the following in your Google Doc text: ```[[[content reference]]] [[annotation | label]]```

## Releasing

First make sure your local is up to date with the origin and that you're on the `main` branch:

```bash
$ git pull
$ git checkout main
```

Next, run `npm version [major|minor|patch]` to increment the version based on the type of changes in this release. We use [Semantic Versioning](https://semver.org/) to increment versions:

- Breaking (non-backwards-compatible) changes should be a `major` release
- New features (that are backwards-compatible) should be `minor`
- Bug fixes should be a `patch`
- Alternatively, you can use `npm version vX.X.X` to set the version yourself.

Finally, run `git push --follow-tags` to push the new version to GitHub, which will trigger the CircleCI pipeline that publishes the new version on NPM.

## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

Please note the MIT licence includes only the software, and does not cover any FT content made available using the software, which is copyright &copy; The Financial Times Limited, all rights reserved. For more information about re-publishing FT content, please contact our [syndication department](http://syndication.ft.com/).
