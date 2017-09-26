# bertha-docs-client

A client library for fetching and transforming markup from Google Documents

## Installation

`npm install bertha-docs-client`

## Usage

```js
import berthaDocs from 'bertha-docs-client'; // or const berthaDocs = require('bertha-docs-client');

const content = await berthaDocs(googleDocId, { transform: transformationFunction });
```

You will need to add a file named `.env` to your project folder with the following secret variables:

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

## API

### berthaDocs(googleDocId, [options])

Fetches the HTML of a Google Doc and returns a promise

#### googleDocId
String (required). A valid Google Doc ID

#### `options`

Plain object (optional).

- `transform`: A function that takes in three arguments (`contentReference`, `annotation`, `label`) and returns a template string. To use this feature, you should wrap your text in the following in your Google Doc text: ```[[[content reference]]] [[annotation | label]]```
