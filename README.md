JavaScript Image Preloader
========================

Optimally preloads images using pure JavaScript.

This library optimizes the preloading of images by segmenting the collection of images by host and ensuring that the optimal number of concurrent downloads per host are occurring until the entire set is preloaded.

Preload many images
```
imgPreloader.push_many([
  'http://i.imgur.com/KxH78.jpg',
  'http://i.imgur.com/KqcH6.jpg',
  'http://i.imgur.com/H7ojI.jpg',
  'http://i.imgur.com/qH1Np.jpg',
  'http://i.imgur.com/fHuhw.jpg',
  'http://i.imgur.com/VMb6H.jpg',
  'http://farm9.staticflickr.com/8319/8056655546_cb770a4374.jpg',
  'http://farm9.staticflickr.com/8457/8051014699_9e39de826c.jpg',
  'http://farm9.staticflickr.com/8456/8055237224_53bbb89ceb.jpg',
  'http://farm9.staticflickr.com/8033/8056649599_723467d306.jpg',
  'http://farm9.staticflickr.com/8039/8052951795_0d5857c892.jpg',
  'http://farm9.staticflickr.com/8454/8057518716_1ab279b468.jpg'
]);
```

Preload single image
```
imgPreloader.push('http://i.imgur.com/KxH78.jpg');
```