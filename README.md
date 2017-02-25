# smarter-tv
Because sometimes I miss cable subscription. Connect your TV to your computer with HDMI as an external monitor and run this portal webpage for a "smarter tv".  
  
This connects you to video, music and game websites. Primarily shows Canadian content and some relative to Calgary, Alberta. Other content is global, USA-specific or UK-specific.  

# purpose
* a portal or "guide of online channels" that hook up your computer to your tv as a replacement for cable.  
* the purpose of this is to save it to your desktop computer's harddrive and customize it to your liking * e.g: edit the html so that weather network goes to your local weather.  

# notes
This shows primarily global and Canadian websites where, at the time of development, could be used to watch tv without a cable subscription (unless noted otherwise). Included are sites for music, games, video.  
  
US flag icons have been added to cards where the target website can only work from an American IP address. Same story for UK flag icons.  
  
Most of these sites work on desktop but do not play video on mobile.  

# features
* target websites open in a new tab  
* lists below logo intended to open a specific area of the target website  
* filter by genre or type using the buttons along the top  
* randomized background image  
* section for keeping note of links to things you'd like to watch later * this saves to HTML localstorage so the watch later list will: a) be cleared if you clear your browser cache, and b) be contained within your browser or chrome browsing profile  

# customizing * adding a new card
1. Find a logo for a website that you'd like to add and add it to the /img folder.
2. Duplicate the html for a card that is similar to one you want to create.
3. Customize the logo img and href to point to the website's logo and website URL. Optionally add additional links below the logo.
4. Pay attention to the classnames in the card will affect the card's visibility depending on which filter buttons are selected

# tech notes
* used a version of Html5Boilerplate.com from early 2016.  
* switched from masonry grid to isotope grid for Isotope plugin's filter capabilities.  
* originally intended for this to be run from harddrive so, images have not been optimized for web and isotope grid is initialized assuming all images are loaded instantly. This approach may still work well as a progressive web app (PWA).  

# ideas for minor version improvements
* initialize isotope grid after visible images are done loading so that this can work better as a webpage  
* ensure this is accessible  
* add a secondary filter group that separates out global content (e.g: Youtube.com), Canadian content, USA content, UK content, and local content (e.g: Calgary, Alberta, Canada). It can be applied along with the primary (existing) filter group.  
* an area to enter in your City.. maybe a zip/postal code.. that can be used to give you contextual content such as local weather. It may also default you to the secondary filter group that shows content available in your location.  
* have it read from a JSON file and populate cards using HTML templates. Allow customzations to the JSON file  
* reminders of things you'd like to watch  
* pull list of video updates from select websites such as netflix  
* add dynamic data to cards from data pulled  
* create Selenium tests that check validity of target URLs  

# next possible major version
* create an alternate way to view that looks like the old TV Guide channel, scrolling a list of available shows  
* host online as a progressive web app using Google's web-starter-kit, which was inspired by Html5Boilerplate Mobile so, we could ditch a lot of the foundational code originally generated by Html5Boilerplate.com  
* build in to a Chrome extension that lets this work like a picture-in-picture (PiP) view, allowing you to "channel surf" while using Chrome.  
* package as a native Windows or OS desktop application  

# ideas for minor version improvements
* initialize isotope grid after visible images are done loading so that this can work better as a webpage
* ensure this is accessible
* add a secondary filter group that separates out global content (e.g: Youtube.com), Canadian content, USA content, UK content, and local content (e.g: Calgary, Alberta, Canada). It can be applied along with the primary (existing) filter group.
* an area to enter in your City.. maybe a zip/postal code.. that can be used to give you contextual content such as local weather. It may also default you to the secondary filter group that shows content available in your location.
* have it read from a JSON file and populate cards using HTML templates. Allow customzations to the JSON file
* reminders of things you'd like to watch
* pull list of video updates from select websites such as netflix
* add dynamic data to cards from data pulled
* create Selenium tests that check validity of target URLs

# next possible major version
* create an alternate way to view that looks like the old TV Guide channel, scrolling a list of available shows
* host online as a progressive web app using Google's web-starter-kit, which was inspired by Html5Boilerplate Mobile so, we could ditch a lot of the foundational code originally generated by Html5Boilerplate.com
* build in to a Chrome extension that lets this work like a picture-in-picture (PiP) view, allowing you to "channel surf" while using Chrome.
* package as a native Windows or OS desktop application. Add controller device input support - e.g: use XBox 360 controller to navigate like in Steam Bigpicture.