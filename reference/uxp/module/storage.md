
<a name="module-storage" id="module-storage"></a>

## storage

* [storage](#module-storage)
    * [.Entry](#module-storage-entry)
        * [.isEntry](#module-storage-entry-isentry) : `boolean`
        * [.isFile](#module-storage-entry-isfile) : `boolean`
        * [.isFolder](#module-storage-entry-isfolder) : `boolean`
        * [.name](#module-storage-entry-name) : `string`
        * [.provider](#module-storage-entry-provider) : `FileSystemProvider`
        * [.url](#module-storage-entry-url) : `string`
        * [.nativePath](#module-storage-entry-nativepath) : `string`
        * [.toString()](#module-storage-entry-tostring)
        * [.copyTo(folder, options)](#module-storage-entry-copyto)
        * [.moveTo(folder, options)](#module-storage-entry-moveto)
        * [.delete()](#module-storage-entry-delete)
        * [.getMetadata()](#module-storage-entry-getmetadata) ⇒ `Promise.<EntryMetadata>`
    * [.EntryMetadata](#module-storage-entrymetadata)
        * [.name](#module-storage-entrymetadata-name) : `string`
        * [.size](#module-storage-entrymetadata-size) : `number`
        * [.dateCreated](#module-storage-entrymetadata-datecreated) : `Date`
        * [.dateModified](#module-storage-entrymetadata-datemodified) : `Date`
        * [.isFile](#module-storage-entrymetadata-isfile) : `boolean`
        * [.isFolder](#module-storage-entrymetadata-isfolder) : `boolean`
    * [.File](#module-storage-file)
        * _instance_
            * [.isFile](#module-storage-file-isfile)
            * [.mode](#module-storage-file-mode) : `Symbol`
            * [.read(options)](#module-storage-file-read) ⇒ `Promise.<(string\|ArrayBuffer)>`
            * [.write(data, options)](#module-storage-file-write)
    * [.FileSystemProvider](#module-storage-filesystemprovider)
        * _instance_
            * [.isFileSystemProvider](#module-storage-filesystemprovider-isfilesystemprovider)
            * [.supportedDomains](#module-storage-filesystemprovider-supporteddomains)
            * [.getFileForOpening(options)](#module-storage-filesystemprovider-getfileforopening) ⇒ `File` \| `Array.<File>`
            * [.getFileForSaving(defaultFileName, options)](#module-storage-filesystemprovider-getfileforsaving) ⇒ `File`
            * [.getFolder(options)](#module-storage-filesystemprovider-getfolder) ⇒ `Folder`
            * [.getTemporaryFolder()](#module-storage-filesystemprovider-gettemporaryfolder)
            * [.getDataFolder()](#module-storage-filesystemprovider-getdatafolder)
            * [.getPluginFolder()](#module-storage-filesystemprovider-getpluginfolder)
            * [.getFsUrl(entry)](#module-storage-filesystemprovider-getfsurl)
            * [.getNativePath(entry)](#module-storage-filesystemprovider-getnativepath)
    * [.Folder](#module-storage-folder) ⇐ `Entry`
        * _instance_
            * [.isFolder](#module-storage-folder-isfolder)
            * [.getEntries()](#module-storage-folder-getentries) ⇒ `Array.<Entry>`
            * [.createEntry(name, options)](#module-storage-folder-createentry) ⇒ `File` \| `Folder`
            * [.createFile(name, options)](#module-storage-folder-createfile) ⇒ `File`
            * [.createFolder(name)](#module-storage-folder-createfolder) ⇒ `Folder`
            * [.getEntry(filePath)](#module-storage-folder-getentry) ⇒ `File` \| `Folder`
            * [.renameEntry(entry, newName, options)](#module-storage-folder-renameentry)
    * [.localFileSystem](#module-storage-localfilesystem) : `LocalFileSystemProvider`
    * [.errors](#module-storage-errors) : `Errors`
        * [.AbstractMethodInvocationError](#module-storage-errors-abstractmethodinvocationerror) ⇐ `Error`
        * [.ProviderMismatchError](#module-storage-errors-providermismatcherror) ⇐ `Error`
        * [.EntryIsNotAnEntryError](#module-storage-errors-entryisnotanentryerror) ⇐ `Error`
        * [.EntryIsNotAFolderError](#module-storage-errors-entryisnotafoldererror) ⇐ `Error`
        * [.EntryIsNotAFileError](#module-storage-errors-entryisnotafileerror) ⇐ `Error`
        * [.NotAFileSystemError](#module-storage-errors-notafilesystemerror) ⇐ `Error`
        * [.OutOfSpaceError](#module-storage-errors-outofspaceerror) ⇐ `Error`
        * [.PermissionDeniedError](#module-storage-errors-permissiondeniederror) ⇐ `Error`
        * [.EntryExistsError](#module-storage-errors-entryexistserror) ⇐ `Error`
        * [.FileIsReadOnlyError](#module-storage-errors-fileisreadonlyerror) ⇐ `Error`
        * [.DomainNotSupportedError](#module-storage-errors-domainnotsupportederror) ⇐ `Error`
        * [.InvalidFileNameError](#module-storage-errors-invalidfilenameerror) ⇐ `Error`
    * [.domains](#module-storage-domains)
        * [.userDesktop](#module-storage-domains-userdesktop) : `Symbol`
        * [.userDocuments](#module-storage-domains-userdocuments) : `Symbol`
        * [.userPictures](#module-storage-domains-userpictures) : `Symbol`
        * [.userVideos](#module-storage-domains-uservideos) : `Symbol`
        * [.userMusic](#module-storage-domains-usermusic) : `Symbol`
        * [.appLocalData](#module-storage-domains-applocaldata) : `Symbol`
        * [.appLocalLibrary](#module-storage-domains-applocallibrary) : `Symbol`
        * [.appLocalCache](#module-storage-domains-applocalcache) : `Symbol`
        * [.appLocalShared](#module-storage-domains-applocalshared) : `Symbol`
        * [.appLocalTemporary](#module-storage-domains-applocaltemporary) : `Symbol`
        * [.appRoamingData](#module-storage-domains-approamingdata) : `Symbol`
        * [.appRoamingLibrary](#module-storage-domains-approaminglibrary) : `Symbol`
    * [.fileTypes](#module-storage-filetypes)
        * [.text](#module-storage-filetypes-text)
        * [.images](#module-storage-filetypes-images)
        * [.all](#module-storage-filetypes-all)
    * [.formats](#module-storage-formats)
        * [.utf8](#module-storage-formats-utf8) : `Symbol`
        * [.binary](#module-storage-formats-binary) : `Symbol`
    * [.modes](#module-storage-modes)
        * [.readOnly](#module-storage-modes-readonly) : `Symbol`
        * [.readWrite](#module-storage-modes-readwrite) : `Symbol`
    * [.types](#module-storage-types)
        * [.file](#module-storage-types-file) : `Symbol`
        * [.folder](#module-storage-types-folder) : `Symbol`


<a name="module-storage-entry" id="module-storage-entry"></a>

### storage.Entry
An `Entry` is the base class for `File` and `Folder`. You'll
never instantiate an `Entry` directly, but it provides
the common fields and methods that both `File` and `Folder`
share.

An Entry object may exist even if the corresponding file/folder on disk does not
currently exist.

It's possible for multiple Entry objects to represent the same item on disk,
for example if the item was picked via multiple separate file picker invocations.

**Kind**: static class of [`storage`](#module-storage)  

* [.Entry](#module-storage-entry)
    * [.isEntry](#module-storage-entry-isentry) : `boolean`
    * [.isFile](#module-storage-entry-isfile) : `boolean`
    * [.isFolder](#module-storage-entry-isfolder) : `boolean`
    * [.name](#module-storage-entry-name) : `string`
    * [.provider](#module-storage-entry-provider) : `FileSystemProvider`
    * [.url](#module-storage-entry-url) : `string`
    * [.nativePath](#module-storage-entry-nativepath) : `string`
    * [.toString()](#module-storage-entry-tostring)
    * [.copyTo(folder, options)](#module-storage-entry-copyto)
    * [.moveTo(folder, options)](#module-storage-entry-moveto)
    * [.delete()](#module-storage-entry-delete)
    * [.getMetadata()](#module-storage-entry-getmetadata) ⇒ `Promise.<EntryMetadata>`


<a name="module-storage-entry-isentry" id="module-storage-entry-isentry"></a>

#### entry.isEntry : `boolean`
Indicates that this instance is an `Entry`. Useful for type-checking.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Example**  
```js
if (something.isEntry) {
    return something.getMetadata();
}
```

<a name="module-storage-entry-isfile" id="module-storage-entry-isfile"></a>

#### entry.isFile : `boolean`
Indicates that this instance is **not** a `File`. Useful for type-
checking.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
if (!anEntry.isFile) {
    return "This entry is not a file.";
}
```

<a name="module-storage-entry-isfolder" id="module-storage-entry-isfolder"></a>

#### entry.isFolder : `boolean`
Indicates that this instance is **not** a folder. Useful for type-
checking.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
if (!anEntry.isFolder) {
    return "This entry is not a folder.";
}
```

<a name="module-storage-entry-name" id="module-storage-entry-name"></a>

#### entry.name : `string`
The name of this entry. Read-only.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
console.log(anEntry.name);
```

<a name="module-storage-entry-provider" id="module-storage-entry-provider"></a>

#### entry.provider : `FileSystemProvider`
The associated provider that services this entry. Read-only.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
if (entryOne.provider !== entryTwo.provider) {
    throw new Error("Providers are not the same");
}
```

<a name="module-storage-entry-url" id="module-storage-entry-url"></a>

#### entry.url : `URL`
The url of this entry. You can use this url as the `src` attribute of an `<img>` tag in the UI. Read-only.

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
console.log(anEntry.url);
```

<a name="module-storage-entry-nativepath" id="module-storage-entry-nativepath"></a>

#### entry.nativePath : `string`
The platform native file-system path of this entry. Read-only

**Kind**: instance property of [`Entry`](#module-storage-entry)  
**Read only**: true  
**Example**  
```js
console.log(anEntry.nativePath);
```

<a name="module-storage-entry-tostring" id="module-storage-entry-tostring"></a>

#### entry.toString()
returns the details of the given entry like name, type and native path in a readable string format.

**Kind**: instance method of [`Entry`](#module-storage-entry)  

<a name="module-storage-entry-copyto" id="module-storage-entry-copyto"></a>

#### entry.copyTo(folder, options)
Copies this entry to the specified `folder`.

The Entry object passed to this function will continue to reference the original item - it is
_not_ updated to reference the copy.

**Kind**: instance method of [`Entry`](#module-storage-entry)  
**Throws**:

- `EntryExists` if the attempt would overwrite an entry and `overwrite` is `false`
- `PermissionDenied` if the underlying file system rejects the attempt
- `OutOfSpace` if the file system is out of storage space


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | `Folder` |  | the folder to which to copy this entry |
| options | `\*` |  |  |
| [options.overwrite] | `boolean` | <code>false</code> | if `true`, allows overwriting existing entries |

**Example**  
```js
await someFile.copyTo(someFolder);
```
**Example**  
```js
await someFile.copyTo(someFolder, {overwrite: true});
```
**Example**  
```js
await someFolder.copyTo(anotherFolder, {overwrite: true});
```

<a name="module-storage-entry-moveto" id="module-storage-entry-moveto"></a>

#### entry.moveTo(folder, options)
Moves this entry to the target folder, optionally specifying a new name.

The Entry object passed to this function is automatically updated to reference the new location,
however any _other_ Entry objects referencing the original item will not be updated, and will thus
no longer point to an item that exists on disk.

**Kind**: instance method of [`Entry`](#module-storage-entry)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | `Folder` |  | the folder to which to move this entry |
| options | `\*` |  |  |
| [options.overwrite] | `boolean` | <code>false</code> | If `true` allows the move to overwrite existing files |
| [options.newName] | `string` |  | If specified, the entry is renamed to this name |

**Example**  
```js
await someFile.moveTo(someFolder);
```
**Example**  
```js
await someFile.moveTo(someFolder, {overwrite: true});
```
**Example**  
```js
await someFolder.moveTo(anotherFolder, {overwrite: true});
```
**Example**  
```js
await someFile.moveTo(someFolder, {newName: 'masterpiece.txt'})
```
**Example**  
```js
await someFile.moveTo(someFolder, {newName: 'novel.txt', {overwrite: true})
```

<a name="module-storage-entry-delete" id="module-storage-entry-delete"></a>

#### entry.delete()
Removes this entry from the file system. If the entry is a folder, all the
contents will also be removed.

**Kind**: instance method of [`Entry`](#module-storage-entry)  
**Example**  
```js
await aFile.delete();
```

<a name="module-storage-entry-getmetadata" id="module-storage-entry-getmetadata"></a>

#### entry.getMetadata() ⇒ `Promise.<EntryMetadata>`
Returns this entry's metadata.

**Kind**: instance method of [`Entry`](#module-storage-entry)  
**Example**  
```js
const metadata = await aFile.getMetadata();
```

<a name="module-storage-entrymetadata" id="module-storage-entrymetadata"></a>

### storage.EntryMetadata
Metadata for an entry. It includes useful information such as:

* size of the file (if a file)
* date created
* date modified
* name

You'll not instantiate this directly; use [Entry#getMetadata](#module-storage-entry-getmetadata) to do so.

**Kind**: static class of [`storage`](#module-storage)  

* [.EntryMetadata](#module-storage-entrymetadata)
    * [.name](#module-storage-entrymetadata-name) : `string`
    * [.size](#module-storage-entrymetadata-size) : `number`
    * [.dateCreated](#module-storage-entrymetadata-datecreated) : `Date`
    * [.dateModified](#module-storage-entrymetadata-datemodified) : `Date`
    * [.isFile](#module-storage-entrymetadata-isfile) : `boolean`
    * [.isFolder](#module-storage-entrymetadata-isfolder) : `boolean`


<a name="module-storage-entrymetadata-name" id="module-storage-entrymetadata-name"></a>

#### entryMetadata.name : `string`
The name of the entry.

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-entrymetadata-size" id="module-storage-entrymetadata-size"></a>

#### entryMetadata.size : `number`
The size of the entry, if a file. Zero if a folder.

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-entrymetadata-datecreated" id="module-storage-entrymetadata-datecreated"></a>

#### entryMetadata.dateCreated : `Date`
The date this entry was created.

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-entrymetadata-datemodified" id="module-storage-entrymetadata-datemodified"></a>

#### entryMetadata.dateModified : `Date`
The date this entry was modified.

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-entrymetadata-isfile" id="module-storage-entrymetadata-isfile"></a>

#### entryMetadata.isFile : `boolean`
Indicates if the entry is a file

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-entrymetadata-isfolder" id="module-storage-entrymetadata-isfolder"></a>

#### entryMetadata.isFolder : `boolean`
Indicates if the entry is a folder

**Kind**: instance property of [`EntryMetadata`](#module-storage-entrymetadata)  

<a name="module-storage-file" id="module-storage-file"></a>

### storage.File
Represents a file on a file system. Provides methods for reading from and
writing to the file. You'll never instantiate a `File` directly; instead
you'll get access via a [FileSystemProvider](#module-storage-filesystemprovider)
method such as [`getFileForOpening()`](#module-storage-file-getfileforopening).

A File object may exist even if the corresponding file on disk does not currently
exist.

It's possible for multiple File objects to represent the same file on disk,
for example if the file was picked via multiple separate file picker invocations.

**Kind**: static class of [`storage`](#module-storage)  

* [.File](#module-storage-file)
    * _instance_
        * [.isFile](#module-storage-file-isfile)
        * [.mode](#module-storage-file-mode) : `Symbol`
        * [.read(options)](#module-storage-file-read) ⇒ `Promise.<(string\|ArrayBuffer)>`
        * [.write(data, options)](#module-storage-file-write)


<a name="module-storage-file-isfile" id="module-storage-file-isfile"></a>

#### file.isFile
Indicates that this instance is a file.

**Kind**: instance property of [`File`](#module-storage-file)  
**Example**  
```js
if (anEntry.isFile) {
    await anEntry.read();
}
```

<a name="module-storage-file-mode" id="module-storage-file-mode"></a>

#### file.mode : `Symbol`
Indicates whether this File object supports read-only or read-write access. See [readOnly](#module-storage-modes-readonly)
and [readWrite](#module-storage-modes-readwrite).

**Kind**: instance property of [`File`](#module-storage-file)  
**Example**  
```js
if (aFile.mode === modes.readOnly) {
    throw new Error("Can't write to a file opened as read-only.");
}
```

<a name="module-storage-file-read" id="module-storage-file-read"></a>

#### file.read(options) ⇒ `Promise.<(string\|ArrayBuffer)>`
Reads data from the file and returns it. The file format can be specified
with the `format` option. If a format is not supplied, the file is assumed
to be a text file using UTF8 encoding.

**Kind**: instance method of [`File`](#module-storage-file)  
**Returns**: `Promise.<(string\|ArrayBuffer)>` - the contents of the file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | `?Object` |  |  |
| [options.format] | `Symbol` | <code>formats.utf8</code> | Optional. Format to read: one of [`storage.formats.utf8`](#module-storage-formats-utf8) or [`storage.formats.binary`](#module-storage-formats-binary). |

**Example**  
```js
const text = await myNovel.read(); // string
```
**Example**  
```js
const data = await myNovel.read({format: formats.binary}); // ArrayBuffer
console.log("File is " + data.byteLength + " bytes long.");
```

<a name="module-storage-file-write" id="module-storage-file-write"></a>

#### file.write(data, options)
Writes data to a file, appending if desired. The format of the file
is controlled via the `format` option, and defaults to UTF8.

**Kind**: instance method of [`File`](#module-storage-file)  
**Throws**:

- `FileIsReadOnly` if writing to a read-only file
- `OutOfSpace` If writing to the file causes the file system to exceed the available space (or quota)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | `string` \| `ArrayBuffer` |  | Data to write to the file |
| options | `?Object` |  |  |
| [options.format] | `Symbol` | <code>formats.utf8</code> | Optional. Format to write: one of [`storage.formats.utf8`](#module-storage-formats-utf8) or [`storage.formats.binary`](#module-storage-formats-binary). |

**Example**  
```js
await myNovel.write("It was a dark and stormy night.\n");
await myNovel.write("Cliches and tropes aside, it really was.", {append: true});
```
**Example**  
```js
const data = new Uint8Array([0xFF, 0xA1]);
await aDataFile.write(data, {format: formats.binary});  // writes a 2-byte file
```


<a name="module-storage-filesystemprovider" id="module-storage-filesystemprovider"></a>

### storage.FileSystemProvider
Provides access to files and folders on a file system. You don't instantiate
this directly; instead you'll use an instance that has already been created for
you.

**Kind**: static class of [`storage`](#module-storage)  

* [.FileSystemProvider](#module-storage-filesystemprovider)
    * _instance_
        * [.isFileSystemProvider](#module-storage-filesystemprovider-isfilesystemprovider)
        * [.supportedDomains](#module-storage-filesystemprovider-supporteddomains)
        * [.getFileForOpening(options)](#module-storage-filesystemprovider-getfileforopening) ⇒ `File` \| `Array.<File>`
        * [.getFileForSaving(defaultFileName, options)](#module-storage-filesystemprovider-getfileforsaving) ⇒ `File`
        * [.getFolder(options)](#module-storage-filesystemprovider-getfolder) ⇒ `Folder`
        * [.getTemporaryFolder()](#module-storage-filesystemprovider-gettemporaryfolder)
        * [.getDataFolder()](#module-storage-filesystemprovider-getdatafolder)
        * [.getPluginFolder()](#module-storage-filesystemprovider-getpluginfolder)
        * [.getFsUrl(entry)](#module-storage-filesystemprovider-getfsurl)
        * [.getNativePath(entry)](#module-storage-filesystemprovider-getnativepath)


<a name="module-storage-filesystemprovider-isfilesystemprovider" id="module-storage-filesystemprovider-isfilesystemprovider"></a>

#### fileSystemProvider.isFileSystemProvider
Indicates that this is a `FileSystemProvider`. Useful for type-checking.

**Kind**: instance property of [`FileSystemProvider`](#module-storage-filesystemprovider)  

<a name="module-storage-filesystemprovider-supporteddomains" id="module-storage-filesystemprovider-supporteddomains"></a>

#### fileSystemProvider.supportedDomains
An array of the domains this file system supports. If the file system can
open a file picker to the user's `documents` folder, for example, then
[userDocuments](userDocuments) will be in this list.

**Kind**: instance property of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Example**  
```js
if (fs.supportedDomains.contains(domains.userDocuments)) {
    console.log("We can open a picker to the user's documents.")
}
```

<a name="module-storage-filesystemprovider-getfileforopening" id="module-storage-filesystemprovider-getfileforopening"></a>

#### fileSystemProvider.getFileForOpening(options) ⇒ `File` \| `Array.<File>`
Gets a file (or files) suitable for reading by displaying an "Open" file
picker dialog to the user. File entries returned by this API are read-only -
use [`getFileForSaving()`](#module-storage-filesystemprovider-getfileforsaving)
to get a File entry you can write to.

The user can select multiple files only if the `allowMultiple` option is `true`.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `?File` if `allowMultiple` is false (null if picker canceled); or `!Array<File>` if `allowMultiple` is true (length 0 if picker canceled)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | `?Object` | | |
| [options.initialDomain] | `Symbol` |  | Optional. Preferred initial location of the file picker, one of the [`storage.domains`](#module-storage-domains) values. If unspecified, uses the location of the most recent file picker dialog. |
| [options.types] | `Array<string>` | <code>["*"]</code> | Optional. Allowed file extensions, with no "." prefix; use `storage.fileTypes.all` to allow any file to be picked |
| [options.allowMultiple] | `boolean` | <code>false</code> | Optional. If true, multiple files can be selected and this API returns `Array<File>`.<br><br>If false, only one file can be selected and this API returns a `File` directly. |

**Example**  
```js
const file = await fs.getFileForOpening({initialDomain: domains.userDocuments});
if (!file) {
    // file picker dialog was canceled
    return;
}
const text = await file.read();
```
**Example**  
```js
const files = await fs.getFileForOpening({allowMultiple: true, types: fileTypes.images});
if (files.length === 0) {
    // no files selected
}
```

<a name="module-storage-filesystemprovider-getfileforsaving" id="module-storage-filesystemprovider-getfileforsaving"></a>

#### fileSystemProvider.getFileForSaving(defaultFileName, options) ⇒ `File`
Gets a file reference suitable for read-write by displaying a "Save" file
picker dialog to the user.

If the act of writing to the file would overwrite it, the file picker
will prompt the user to confirm before returning a result to you.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `File` - returns the selected file, or `null` if canceled.

| Param | Type | Description |
| --- | --- | --- |
| defaultFileName | `string` | Required. The file extension should match one of the options specified in the `types` option. |
| options | `!Object` |  |
| [options.initialDomain] | `Symbol` | Optional. Preferred initial location of the file picker, one of the [`storage.domains`](#module-storage-domains) values. If unspecified, uses the location of the most recent file picker dialog. |
| [options.types] | `Array.<string>` | Required. Allowed file extensions, with no "." prefix. |

**Example**  
```js
const file = await fs.getFileForSaving("output.txt", { types: [ "txt" ]});
if (!file) {
    // file picker dialog was canceled
    return;
}
await file.write("It was a dark and stormy night");
```

<a name="module-storage-filesystemprovider-getfolder" id="module-storage-filesystemprovider-getfolder"></a>

#### fileSystemProvider.getFolder(options) ⇒ `Folder`
Gets a folder from the file system via a folder picker dialog. The files
and folders within can be accessed via [Folder#getEntries](Folder#getEntries). Any
files within are read-write.

If the user cancels the picker, `null` is returned instead.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `Folder` - the selected folder or `null` if canceled.

| Param | Type | Description |
| --- | --- | --- |
| options | `?Object` |  |
| [options.initialDomain] | `Symbol` | Optional. Preferred initial location of the file picker, one of the [`storage.domains`](#module-storage-domains) values. If unspecified, uses the location of the most recent file picker dialog. |

**Example**  
```js
const folder = await fs.getFolder();
const myNovel = (await fs.getEntries()).find(entry => entry.name.includes('novel'));
const text = await myNovel.read();
```

<a name="module-storage-filesystemprovider-gettemporaryfolder" id="module-storage-filesystemprovider-gettemporaryfolder"></a>

#### fileSystemProvider.getTemporaryFolder()
Returns a temporary folder. The contents of the folder may be lost when
the host application is closed.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `Folder`
**Example**  
```js
const temp = await fs.getTemporaryFolder();
```

<a name="module-storage-filesystemprovider-getdatafolder" id="module-storage-filesystemprovider-getdatafolder"></a>

#### fileSystemProvider.getDataFolder()
Returns a folder that can be used for storing plugin-specific data without needing user
interaction though a file picker. Its contents remain persistent when the host
application is updated _and_ when your plugin is updated.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `Folder`

<a name="module-storage-filesystemprovider-getpluginfolder" id="module-storage-filesystemprovider-getpluginfolder"></a>

#### fileSystemProvider.getPluginFolder()
Returns the plugin's install folder for _read only_ access. This folder contains all the
contents of the plugin package file.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `Folder`

<a name="module-storage-filesystemprovider-getfsurl" id="module-storage-filesystemprovider-getfsurl"></a>

#### fileSystemProvider.getFsUrl(entry)
Returns the fs url of given entry.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `URL`

<a name="module-storage-filesystemprovider-getnativepath" id="module-storage-filesystemprovider-getnativepath"></a>

#### fileSystemProvider.getNativePath(entry)
Returns the platform native file system path of given entry.

**Kind**: instance method of [`FileSystemProvider`](#module-storage-filesystemprovider)  
**Returns**: `string`


<a name="module-storage-folder" id="module-storage-folder"></a>

### storage.Folder ⇐ `Entry`
Represents a folder on a file system. You'll never instantiate this directly,
but will get it by calling [FileSystemProvider#getTemporaryFolder](FileSystemProvider#getTemporaryFolder),
[FileSystemProvider#getFolder](FileSystemProvider#getFolder), or via [Folder#getEntries](Folder#getEntries).

A Folder object may exist even if the corresponding folder on disk does not currently
exist.

It's possible for multiple Folder objects to represent the same folder on disk,
for example if the folder was picked via multiple separate folder picker invocations.

**Kind**: static class of [`storage`](#module-storage)  
**Extends**: `Entry`  

* [.Folder](#module-storage-folder) ⇐ `Entry`
    * _instance_
        * [.isFolder](#module-storage-folder-isfolder)
        * [.getEntries()](#module-storage-folder-getentries) ⇒ `Array.<Entry>`
        * [.createEntry(name, options)](#module-storage-folder-createentry) ⇒ `File` \| `Folder`
        * [.createFile(name, options)](#module-storage-folder-createfile) ⇒ `File`
        * [.createFolder(name)](#module-storage-folder-createfolder) ⇒ `Folder`
        * [.getEntry(filePath)](#module-storage-folder-getentry) ⇒ `File` \| `Folder`
        * [.renameEntry(entry, newName, options)](#module-storage-folder-renameentry)


<a name="module-storage-folder-isfolder" id="module-storage-folder-isfolder"></a>

#### folder.isFolder
Indicates that this instance is a folder. Useful for type checking.

**Kind**: instance property of [`Folder`](#module-storage-folder)  

<a name="module-storage-folder-getentries" id="module-storage-folder-getentries"></a>

#### folder.getEntries() ⇒ `Array.<Entry>`
Returns an array of entries contained within this folder.

**Kind**: instance method of [`Folder`](#module-storage-folder)  
**Returns**: `Array.<Entry>` - The entries within the folder.  
**Example**  
```js
const entries = await aFolder.getEntries();
const allFiles = entries.filter(entry => entry.isFile);
```

<a name="module-storage-folder-createentry" id="module-storage-folder-createentry"></a>

#### folder.createEntry(name, options) ⇒ `File` \| `Folder`
Behavior depends on type:
* `file` - Returns a File entry but does not create or change the file on disk
* `folder` - Creates a folder on disk and returns a Folder entry for it

See [`createFile()`](#module-storage-folder-createfile) and [`createFolder()`](#module-storage-folder-createfolder)
for details on the behavior of these two modes.

**Kind**: instance method of [`Folder`](#module-storage-folder)  
**Returns**: `File` \| `Folder` - the created entry  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | `string` |  | the name of the entry to create |
| options | `?Object` |  |  |
| [options.type] | `Symbol` | <code>types.file</code> | Which kind of entry to create. Pass [folder](#typesfolder) to create a new folder. Pass [file](#typesfile) to create a File entry but _not_ modify anything on disk yet. |
| [options.overwrite] | `boolean` | <code>false</code> | Only relevant when creating a _File._ If `false`, the call will fail if the file already exists. If `true`, the call will succeed regardless of whether the file currently exists on disk. |

**Example**  
```js
const myNovel = await aFolder.createEntry("mynovel.txt");
```
**Example**  
```js
const catImageCollection = await aFolder.createEntry("cats", {type: storage.types.folder});
```

<a name="module-storage-folder-createfile" id="module-storage-folder-createfile"></a>

#### folder.createFile(name, options) ⇒ `File`
Creates a File object within this folder, which need not correspond to a file that exists on disk
yet.

* If the file already exists on disk (and `overwrite` is true), creates a File object but does not
  modify the existing file on disk in any way.
* If the file does not exist yet, creates a File object but does _not_ create the file on disk yet.
  You can then use [`File.write()`](#module-storage-file-write) to create the file and give it
  content.

**Kind**: instance method of [`Folder`](#module-storage-folder)  
**Returns**: `File` - the created file entry  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | `string` |  | the name of the file to create. |
| options | `?Object` |  |  |
| [options.overwrite] | `boolean` | <code>false</code> | If `false`, the call will fail if the file already exists. If `true`, the call will succeed regardless of whether the file currently exists on disk. |

**Example**  
```js
const myNovelTxtFile = await aFolder.createFile("mynovel.txt");
```

<a name="module-storage-folder-createfolder" id="module-storage-folder-createfolder"></a>

#### folder.createFolder(name) ⇒ `Folder`
Creates a Folder object within this folder _and_ creates the folder on disk. Unlike `createFile()`,
this call _does_ modify the disk, and it cannot be used if the folder already exists (use [`getEntry()`](#module-storage-folder-getentry)
in that case).

* If the folder already exists on disk, fails with an error.
* If the folder does not exist yet, immediately creates it on disk and then returns a Folder object
  for it.

**Kind**: instance method of [`Folder`](#module-storage-folder)  
**Returns**: `Folder` - the created folder entry object  

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | the name of the folder to create. |

**Example**  
```js
const myCollectionsFolder = await aFolder.createFolder("collections");
```

<a name="module-storage-folder-getentry" id="module-storage-folder-getentry"></a>

#### folder.getEntry(filePath) ⇒ `File` \| `Folder`
Returns a File or Folder entry for an item that already exists on disk within this folder or
its hierarchy of subfolders. Fails if no entry with the given name/path currently exists on disk.

**Kind**: instance method of [`Folder`](#module-storage-folder)  
**Returns**: `File` \| `Folder` - the fetched entry.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | `string` | Name, with optional relative path prefix, of an existing entry within this folder |

**Example**  
```js
const myNovel = await aFolder.getEntry("mynovel.txt");
```

<a name="module-storage-folder-renameentry" id="module-storage-folder-renameentry"></a>

#### folder.renameEntry(entry, newName, options)
Renames an item on disk to a new name within the same folder. The Entry object passed to this
function is automatically updated to reference the new name, however any _other_ Entry objects
referencing the original item will not be updated, and will thus no longer point to an item that
exists on disk.

**Kind**: instance method of [`Folder`](#module-storage-folder)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entry | `Entry` |  | entry to rename (File or Folder). Must exist. |
| newName | `string` |  | the new name to assign |
| options | `any` |  |  |
| [options.overwrite] | `boolean` | <code>false</code> | if `true`, renaming can overwrite an existing entry |

**Example**  
```js
await myNovels.rename(myNovel, "myFantasticNovel.txt");
```


<a name="module-storage-localfilesystem" id="module-storage-localfilesystem"></a>

### storage.localFileSystem : `LocalFileSystemProvider`
**Kind**: static property of [`storage`](#module-storage)  

<a name="module-storage-errors" id="module-storage-errors"></a>

### storage.errors : `Errors`
**Kind**: static property of [`storage`](#module-storage)  

* [.errors](#module-storage-errors) : `Errors`
    * [.AbstractMethodInvocationError](#module-storage-errors-abstractmethodinvocationerror) ⇐ `Error`
    * [.ProviderMismatchError](#module-storage-errors-providermismatcherror) ⇐ `Error`
    * [.EntryIsNotAnEntryError](#module-storage-errors-entryisnotanentryerror) ⇐ `Error`
    * [.EntryIsNotAFolderError](#module-storage-errors-entryisnotafoldererror) ⇐ `Error`
    * [.EntryIsNotAFileError](#module-storage-errors-entryisnotafileerror) ⇐ `Error`
    * [.NotAFileSystemError](#module-storage-errors-notafilesystemerror) ⇐ `Error`
    * [.OutOfSpaceError](#module-storage-errors-outofspaceerror) ⇐ `Error`
    * [.PermissionDeniedError](#module-storage-errors-permissiondeniederror) ⇐ `Error`
    * [.EntryExistsError](#module-storage-errors-entryexistserror) ⇐ `Error`
    * [.FileIsReadOnlyError](#module-storage-errors-fileisreadonlyerror) ⇐ `Error`
    * [.DomainNotSupportedError](#module-storage-errors-domainnotsupportederror) ⇐ `Error`
    * [.InvalidFileNameError](#module-storage-errors-invalidfilenameerror) ⇐ `Error`


<a name="module-storage-errors-abstractmethodinvocationerror" id="module-storage-errors-abstractmethodinvocationerror"></a>

#### errors.AbstractMethodInvocationError ⇐ `Error`
Attempted to invoke an abstract method.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-providermismatcherror" id="module-storage-errors-providermismatcherror"></a>

#### errors.ProviderMismatchError ⇐ `Error`
Attempted to execute a command that required the providers of all
entries to match.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-entryisnotanentryerror" id="module-storage-errors-entryisnotanentryerror"></a>

#### errors.EntryIsNotAnEntryError ⇐ `Error`
The object passed as an entry is not actually an `Entry`.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-entryisnotafoldererror" id="module-storage-errors-entryisnotafoldererror"></a>

#### errors.EntryIsNotAFolderError ⇐ `Error`
The entry is not a folder, but was expected to be a folder.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-entryisnotafileerror" id="module-storage-errors-entryisnotafileerror"></a>

#### errors.EntryIsNotAFileError ⇐ `Error`
The entry is not a file, but was expected to be.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-notafilesystemerror" id="module-storage-errors-notafilesystemerror"></a>

#### errors.NotAFileSystemError ⇐ `Error`
The instance was expected to be a file system, but wasn't.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-outofspaceerror" id="module-storage-errors-outofspaceerror"></a>

#### errors.OutOfSpaceError ⇐ `Error`
The file system is out of space (or quota has been exceeded)

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-permissiondeniederror" id="module-storage-errors-permissiondeniederror"></a>

#### errors.PermissionDeniedError ⇐ `Error`
The file system revoked permission to complete the requested
action.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-entryexistserror" id="module-storage-errors-entryexistserror"></a>

#### errors.EntryExistsError ⇐ `Error`
An attempt was made to overwrite an entry without indicating
that it was safe to do so via `overwrite: true`.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-fileisreadonlyerror" id="module-storage-errors-fileisreadonlyerror"></a>

#### errors.FileIsReadOnlyError ⇐ `Error`
An attempt was made to write to a file that was opened as
read-only.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-domainnotsupportederror" id="module-storage-errors-domainnotsupportederror"></a>

#### errors.DomainNotSupportedError ⇐ `Error`
Domain is not supported by the current FileSystemProvider
instance.

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-errors-invalidfilenameerror" id="module-storage-errors-invalidfilenameerror"></a>

#### errors.InvalidFileNameError ⇐ `Error`
The file name contains invalid characters

**Kind**: static class of [`errors`](#module-storage-errors)  
**Extends**: `Error`  

<a name="module-storage-domains" id="module-storage-domains"></a>

### storage.domains
Common locations that we can use when displaying a file picker.

**Kind**: static constant of [`storage`](#module-storage)  

* [.domains](#module-storage-domains)
    * [.userDesktop](#module-storage-domains-userdesktop) : `Symbol`
    * [.userDocuments](#module-storage-domains-userdocuments) : `Symbol`
    * [.userPictures](#module-storage-domains-userpictures) : `Symbol`
    * [.userVideos](#module-storage-domains-uservideos) : `Symbol`
    * [.userMusic](#module-storage-domains-usermusic) : `Symbol`
    * [.appLocalData](#module-storage-domains-applocaldata) : `Symbol`
    * [.appLocalLibrary](#module-storage-domains-applocallibrary) : `Symbol`
    * [.appLocalCache](#module-storage-domains-applocalcache) : `Symbol`
    * [.appLocalShared](#module-storage-domains-applocalshared) : `Symbol`
    * [.appLocalTemporary](#module-storage-domains-applocaltemporary) : `Symbol`
    * [.appRoamingData](#module-storage-domains-approamingdata) : `Symbol`
    * [.appRoamingLibrary](#module-storage-domains-approaminglibrary) : `Symbol`


<a name="module-storage-domains-userdesktop" id="module-storage-domains-userdesktop"></a>

#### domains.userDesktop : `Symbol`
The user's desktop folder

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-userdocuments" id="module-storage-domains-userdocuments"></a>

#### domains.userDocuments : `Symbol`
The user's documents folder

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-userpictures" id="module-storage-domains-userpictures"></a>

#### domains.userPictures : `Symbol`
The user's pictures folder or library

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-uservideos" id="module-storage-domains-uservideos"></a>

#### domains.userVideos : `Symbol`
The user's videos / movies folder or library

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-usermusic" id="module-storage-domains-usermusic"></a>

#### domains.userMusic : `Symbol`
The user's music folder or library

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-applocaldata" id="module-storage-domains-applocaldata"></a>

#### domains.appLocalData : `Symbol`
Local application data

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-applocallibrary" id="module-storage-domains-applocallibrary"></a>

#### domains.appLocalLibrary : `Symbol`
Local application library

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-applocalcache" id="module-storage-domains-applocalcache"></a>

#### domains.appLocalCache : `Symbol`
Local application cache directory (persistence not guaranteed)

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-applocalshared" id="module-storage-domains-applocalshared"></a>

#### domains.appLocalShared : `Symbol`
Local application shared data folder

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-applocaltemporary" id="module-storage-domains-applocaltemporary"></a>

#### domains.appLocalTemporary : `Symbol`
Local temporary directory

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-approamingdata" id="module-storage-domains-approamingdata"></a>

#### domains.appRoamingData : `Symbol`
Roaming application data

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-domains-approaminglibrary" id="module-storage-domains-approaminglibrary"></a>

#### domains.appRoamingLibrary : `Symbol`
Roaming application library data

**Kind**: static property of [`domains`](#module-storage-domains)  

<a name="module-storage-filetypes" id="module-storage-filetypes"></a>

### storage.fileTypes
This namespace describes the various file type extensions that can used be used in some FS file open methods.

**Kind**: static constant of [`storage`](#module-storage)  

* [.fileTypes](#module-storage-filetypes)
    * [.text](#module-storage-filetypes-text)
    * [.images](#module-storage-filetypes-images)
    * [.all](#module-storage-filetypes-all)


<a name="module-storage-filetypes-text" id="module-storage-filetypes-text"></a>

#### fileTypes.text
Text file extensions

**Kind**: static property of [`fileTypes`](#module-storage-filetypes)  

<a name="module-storage-filetypes-images" id="module-storage-filetypes-images"></a>

#### fileTypes.images
Image file extensions

**Kind**: static property of [`fileTypes`](#module-storage-filetypes)  

<a name="module-storage-filetypes-all" id="module-storage-filetypes-all"></a>

#### fileTypes.all
All file types

**Kind**: static property of [`fileTypes`](#module-storage-filetypes)  

<a name="module-storage-formats" id="module-storage-formats"></a>

### storage.formats
This namespace describes the file content formats supported in FS methods like read and write.

**Kind**: static constant of [`storage`](#module-storage)  

* [.formats](#module-storage-formats)
    * [.utf8](#module-storage-formats-utf8) : `Symbol`
    * [.binary](#module-storage-formats-binary) : `Symbol`


<a name="module-storage-formats-utf8" id="module-storage-formats-utf8"></a>

#### formats.utf8 : `Symbol`
UTF8 File encoding

**Kind**: static property of [`formats`](#module-storage-formats)  

<a name="module-storage-formats-binary" id="module-storage-formats-binary"></a>

#### formats.binary : `Symbol`
Binary file encoding

**Kind**: static property of [`formats`](#module-storage-formats)  

<a name="module-storage-modes" id="module-storage-modes"></a>

### storage.modes
This namespace describes the access modes that can be supported by a given File entry.

**Kind**: static constant of [`storage`](#module-storage)  

* [.modes](#module-storage-modes)
    * [.readOnly](#module-storage-modes-readonly) : `Symbol`
    * [.readWrite](#module-storage-modes-readwrite) : `Symbol`


<a name="module-storage-modes-readonly" id="module-storage-modes-readonly"></a>

#### modes.readOnly : `Symbol`
The file is read-only; attempts to write will fail.

**Kind**: static property of [`modes`](#module-storage-modes)  

<a name="module-storage-modes-readwrite" id="module-storage-modes-readwrite"></a>

#### modes.readWrite : `Symbol`
The file is read-write.

**Kind**: static property of [`modes`](#module-storage-modes)  

<a name="module-storage-types" id="module-storage-types"></a>

### storage.types
This namespace describes the type of the entry. Whether file or folder etc.

**Kind**: static constant of [`storage`](#module-storage)  

* [.types](#module-storage-types)
    * [.file](#module-storage-types-file) : `Symbol`
    * [.folder](#module-storage-types-folder) : `Symbol`


<a name="module-storage-types-file" id="module-storage-types-file"></a>

#### types.file : `Symbol`
A file; used when creating an entity

**Kind**: static property of [`types`](#module-storage-types)  

<a name="module-storage-types-folder" id="module-storage-types-folder"></a>

#### types.folder : `Symbol`
A folder; used when creating an entity

**Kind**: static property of [`types`](#module-storage-types)  
