# Basic Text Area Mod for TIBCO Spotfire®

The basic text area mod allow you to add basic textual descriptions to dashboards and analyses from the Spotfire Web UI.

![Screenshot](screenshot.png)

## Try this mod in Spotfire Analyst

### How to open the mod

1. Open Spotfire, and create an analysis by loading some data.
2. Unzip the downloaded file, and locate the .mod file in the unzipped folder.
3. Drag the file into the analysis.
4. The visualization mod is added to the analysis.
5. To learn about the capabilities and limitations of this visualization mod, keep reading.

For general information on how to use and share visualization mods, [read the Spotfire documentation](https://docs.tibco.com/pub/sfire-analyst/11.0.0/doc/html/en-US/TIB_sfire-analyst_UsersGuide/index.htm?_ga=2.41319073.2072719993.1606728875-1950738096.1600074380#t=modvis%2Fmodvis_how_to_use_a_visualization_mod.htm).

## Data requirement

There are no data requirements since the Mod does not display any data from the analysis.

## Setting up the mod

1. Switch your analysis to Editing mode.
2. Double click in the Mod.
3. Type in any text. Use [markdown](https://commonmark.org/) for basic formatting.
4. Hit Save to commit your changes and display the text.
5. Hit Cancel to ignore any changes.

### Markdown Formatting

Simple formatting can be done using [Markdown](https://commonmark.org/).:

```
# Header 1
## Header 2
### Header 3

- List
- List
    - Sublist
    - Sublist
- List
- List

1. One
2. Two
3. Three

*Italic*

**Bold**
```

## HTML

More advanced formatting can be done with inline HTML, E.g.

```
<table>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
<tr>
<td>Cell 3</td>
<td>Cell 4</td>
</tr>
</table>
```

## Styling

By default the text area will use the same style as the rest of Spotfire. E.g. it adapts to light and dark mode and you can change the font familly, font size etc. by changing the general visualization font.

More advanced styling can be done with an inline CSS, E.g. the following will change all primary headers to red:

```
<style>
    h1 {
      color: red;
    }
</style>
```

## Images

Vector drawings can be added using SVG:

```
<svg height="150" width="400">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
</svg>
```

## Building the mod

### Developing the mod

Build Project

In a terminal window:

-   `npm install`
-   `npm run build-watch`

In a new terminal window

-   `npm run server`

### Build for production

The development version of bundle.js is uncompressed and not suitable for end users. Run the following command to compress the bundle.

-   `npm run build`

## More information about TIBCO Spotfire® Mods

-   [Spotfire® Mods on the TIBCO Community Exchange](https://community.tibco.com/exchange): A safe and trusted place to discover ready-to-use mods
-   [Spotfire® Mods Developer Documentation](https://tibcosoftware.github.io/spotfire-mods/docs/): Introduction and tutorials for mods developers
-   [Spotfire® Mods by TIBCO Spotfire®](https://github.com/TIBCOSoftware/spotfire-mods/releases/latest): A public repository for example projects

## Version history
