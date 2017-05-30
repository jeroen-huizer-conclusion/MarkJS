Mark JS
=============


## Description

A simple tool to highlight occurences of text on a page, based on MarkJS.

## Features:
- Mark all occurences of a text attribute in a given scope
- Highlight color configurable
- Use wildcards in your search
- Optionally, show a button to toggle the markings on/off

## Limitations
- Navigating away from the page, without closing it will leave the highlights intact.
- Does not (yet) include searching based on regex. 

## Dependencies

- [Mendix 6.x Environment](https://appstore.mendix.com/).
- [jQuery](http://jquery.com/download/) (unminified, added to the package)
- [mark.js](https://www.markjs.io) (jquery plugin version, added to the package)

## Configuration

Add the .mpk in dist to your project or build it yourself using:

```
gulp build
```

Add the widget to a dataview and select the text attribute whose contents you would like to mark on the page.

## Properties

- Search attribute: The attribute to use as search parameter.
- Accuracy: mark text that contains, equals or complements the search string.
- Separate word search: mark words in the search string individually, or mark whole search.
- Case sensitive: ignore case when marking matches.
- Ignore diacritics: ignore diacritics when marking matches.
- Use wildcards: Enable or disable wildcards.
- Highlight color: The color used to highlight matches, choose from predefined options or use a custom color.
- Inserted element: control the tag that is inserted to highlight matches.
- Search context: control the scope of where to mark text.
- Refresh: Periodically refresh the matches your page.
- Show Toggle Button: Show a button to toggle the markings on / off.
- Caption: add a caption for the toggle button, for both an enabled / disabled states. 
- Icon: add a glyphicon class name as icon, for both enabled / disabled states.