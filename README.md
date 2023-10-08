[![Release Status](https://img.shields.io/github/release/su-pull/react-magic-card.svg)](https://github.com/su-pull/react-magic-card/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-magic-card)](https://bundlephobia.com/package/react-magic-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is the framer motion animation components, that support images gallery.

## Installation

```sh
npm install react-magic-card framer-motion
```

## Usage Guide

```tsx
import { StraightInfinity } from 'react-magic-card'

function MyComponent() {
  const images = [
    {
      src: '/cat.jpeg',
      alt: 'alt'
    },
    {
      src: '/dog.jpeg',
      alt: 'alt'
    },
    {
      src: '/bird.jpeg',
      alt: 'alt'
    }
  ]

  return (
    <StraightInfinity
      images={images}
      width={100}
      height={100}
      controller={100}
      start={Math.ceil(images.length / 2 - 1)}
    />
  )
}
```

## Common Properties

| Property              | Meaning                                                           |
| --------------------- | ----------------------------------------------------------------- |
| images (required)     | array of images and objects containing the src and alt properties |
| start (required)      | index number of the array of start scale position                 |
| width (required)      | width of the single image                                         |
| height (required)     | height of the single image                                        |
| controller (required) | controller size is add to the size of the component               |
| offsetIndex           | add an offset to the index of the components and images           |
| reverseIndex          | order the change the overlap of zindex default true               |
| className             | className of the component                                        |
| classImages           | className of the images                                           |
| classImageSelect      | className of the select image                                     |
| classImageUnique      | className of the index number is assigned to the end              |
| animate               | object in the animation property                                  |
| initial               | object in the animation property                                  |
| transition            | object in the transition property                                 |
| detailTransition      | object in the transition property                                 |
| detailProperty        | object in the detail property                                     |
| loading               | loading attribute of img element in html                          |
| initialFadeRange      | range of fade animation after page loaded                         |
| initialTransTime      | transition time of fade animation after page loaded               |

## CircleRotation Properties

| Property          | Meaning              |
| ----------------- | -------------------- |
| radius (required) | radius of the circle |

## StraightInfinity Properties

| Property | Meaning                                 |
| -------- | --------------------------------------- |
| vertical | vertical or horizontal the default true |
| margin   | spacing of the between images           |

## Animation Object

| Property      | Meaning                               |
| ------------- | ------------------------------------- |
| scale         | scaling of the images                 |
| opacity       | opacity or transparency of the images |
| rotateX       | X-axis rotation of the images         |
| rotateY       | Y-axis rotation of the images         |
| rotateZ       | Z-axis rotation of the images         |
| selectScale   | scaling of the selected image         |
| selectOpacity | opacity of the selected image         |
| selectRotateX | X-axis rotation of the selected image |
| selectRotateY | Y-axis rotation of the selected image |
| selectRotateZ | Z-axis rotation of the selected image |

## Transition Object

It is Inherits framer motion transition object ease and (type: 'spring').

## detailProperty Object

| Property    | Meaning                                                   |
| ----------- | --------------------------------------------------------- |
| classDetail | className of the detail image                             |
| white       | white or black for background the default true            |
| alpha       | background transparency of a number between 0 ~ 1         |
| blur        | blur intensity of a number between 1 ~ 20 a preferred     |
| scale       | scale of the detail image                                 |
| offset      | offset of an appearance position from the center position |

## License

The MIT License.
