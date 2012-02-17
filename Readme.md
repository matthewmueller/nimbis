## Namespace Conventions ##

    window.nb = {
      m : [...],
      c : [...],
      v  : [...],
      ui : [...]
    };

### Description
* **m** : This will be where the model classes go
* **c** : This will be where the collection classes go
* **v** : This will be where the view classes go
* **ui** : Instance of the view

> Model and collection instances will be attached onto the main nimbis object. **They will be in lowercase.**

#### Examples:
* **Models** : nb.m.Photo
* **Model (instance) **: nb.photo
* **Collection** : nb.c.Photos
* **Collection (instance)** : nb.photos
* **Main Router** : nb.router
* **Views** : nb.v.PhotoList
* **View (instance)** : nb.ui.photoList