# react-magic-card

[![Release Status](https://img.shields.io/github/release/su-pull/react-magic-card.svg)](https://github.com/su-pull/react-magic-card/releases/latest)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/react-magic-card)](https://bundlephobia.com/package/react-magic-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is the framer motion component, that supports illust and photograph galleries.

## Installation

```sh
npm install react-magic-card framer-motion
```

## Usage

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
      data={images}
      width={120}
      height={120}
      radius={100}
      controller={200}
      start={1}
      dynamic={true}
      wheelDelay={100}
      animate={{
        scale: 0.8,
        rotateX: 70,
        rotateY: 40,
        rotateZ: -50,
        selectScale: 1.6,
        selectRotateX: 40,
        selectRotateY: 40,
        selectRotateZ: -10
      }}
      transition={{ duration: 0.2 }}
    />
  )
}
```

| Property         | Explanation                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| images           | array of images and objects containing the src and alt properties.       |
| width            | width of a single image.                                                 |
| height           | height of a single image.                                                |
| dynamic          | indicating whether dynamic rotation is allowed.                          |
| start            | index number of the starting scale position.                             |
| radius           | radius of the circle.                                                    |
| controller       | diameter plus the value of the controller is the size of the controller. |
| className        | class name of the component.                                             |
| classImage       | class name of the images.                                                |
| classImageUnique | index number is assigned to the end of the class name set for this.      |
| animate          | object in the animation property.                                        |
| initial          | object in the animation property.                                        |
| transition       | object in the transition property.                                       |

## Animation property

- scale
- opacity
- rotateX
- rotateY
- rotateZ
- selectScale
- selectOpacity
- selectRotateX
- selectRotateY
- selectRotateZ

## Transition property

It Inherits framer motion transition properties other than intera.

## License

MIT License
