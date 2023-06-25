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

## Properties

- data: An array a images property objects for src and alt.
- width: The width of single image.
- height: The height a single image.
- dynamic: A flag indicating whether dynamic rotation is allow.
- start: The Index number, start scale position
- radius: The radius of the circle.
- controller: The diameter plus the value of the controller is the size of the controller.
- className: The class name of the component.
- classImage: The class name of the images.
- classImageUnique: An index number is assigned to the end of the class name set for this.
- animate: An object in the animation property.
- initial: An object in the animation property.
- transition: An object in the transition property.

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
