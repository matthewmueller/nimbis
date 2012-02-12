## Namespace Conventions ##

window.nimbis = {
  models : [...],
  collections : [...],
  views  : [...], // Or ui : [...]
  app    : [...]
};

### Description
* models : This will be where the model classes go
* collections : This will be where the collection classes go
* views : This will be where the view classes go
* view (instance) : descriptive name of what the view actually is (sidebar, search, etc.)
* app : This will be where the instances of these classes go


#### Examples:
* Models : nimbis.models.Photo
* Model (instance) : nimbis.app.photo
* Collection : nimbis.collections.Photos
* Collection (instance) : nimbis.app.photos
* Main Router : nimbis.Router
* Views : nimbis.views.photo
* nimbis.app.photoView (photoGallery)