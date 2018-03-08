# structured-google-docs-client

A client library for fetching and transforming markup from Google Documents

## Installation

`npm install structured-google-docs-client`

## Usage

```js
import structuredGoogleDoc from 'structured-google-docs-client'; // or const structuredGoogleDoc = require('structured-google-docs-client');

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


## Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).

Please note the MIT licence includes only the software, and does not cover any FT content made available using the software, which is copyright &copy; The Financial Times Limited, all rights reserved. For more information about re-publishing FT content, please contact our [syndication department](http://syndication.ft.com/).
