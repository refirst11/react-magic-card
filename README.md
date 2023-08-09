# react-magic-card

[![Release Status](https://img.shields.io/github/release/su-pull/react-magic-card.svg)](https://github.com/su-pull/react-magic-card/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-magic-card)](https://bundlephobia.com/package/react-magic-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is the framer motion components, that support images gallery.

## Installation

```sh
npm install react-magic-card framer-motion
```

## Usage Guide

```tsx
import { MagicCircle } from 'react-magic-card'

function MyComponent() {
  const images = [
    {
      src: '/1.jpeg',
      alt: '1image'
    },
    {
      src: '/2.jpeg',
      alt: '2image'
    },
    {
      src: '/3.jpeg',
      alt: '3image'
    }
  ]

  return (
    <MagicCircle
      images={images}
      width={120}
      height={120}
      radius={100}
      controller={200}
      start={1}
      delay={100}
    />
  )
}
```

## Common Properties

| Property         | Meaning                                                           |
| ---------------- | ----------------------------------------------------------------- |
| images           | array of images and objects containing the src and alt properties |
| width            | width of the single image                                         |
| height           | height of the single image                                        |
| start            | index number of the array of starting scale position              |
| controller       | controller size is add to the size of the component               |
| delay            | delay of the animation firing interval                            |
| offsetIndex      | add an offset to the index of the components and images           |
| reverseIndex     | reverse index order the default true                              |
| className        | className of the component                                        |
| classImages      | className of the images                                           |
| classImageSelect | className of the select image                                     |
| classImageUnique | className of the index number is assigned to the end              |
| animate          | object in the animation property                                  |
| initial          | object in the animation property                                  |
| transition       | object in the transition property                                 |
| pickTransition   | object in the transition property                                 |
| pickProperty     | object in the pick property                                       |

## MagicCircle Properties

| Property | Meaning                                         |
| -------- | ----------------------------------------------- |
| radius   | radius of the circle                            |
| dynamic  | dynamic or static for rotation the default true |

## MagicStraight Properties

| Property      | Meaning                                 |
| ------------- | --------------------------------------- |
| vertical      | vertical or horizontal the default true |
| margin        | spacing of the between images           |
| selectOffsetX | X-axis position                         |
| selectOffsetY | Y-axis position                         |

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

It is Inherits framer motion transition object other than intera.

## PickProperty Object

| Property  | Meaning                                                   |
| --------- | --------------------------------------------------------- |
| classPick | className of the pick image                               |
| white     | white or black for background the default true            |
| alpha     | background transparency of a number between 0 ~ 1         |
| blur      | blur intensity of a number between 1 ~ 20 a preferred     |
| scale     | scale of the pick image                                   |
| offset    | offset of an appearance position from the center position |

## License

The MIT License.
