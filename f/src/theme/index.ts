import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#1A1A1A',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'white',
          color: 'black',
          _hover: {
            bg: 'gray.200',
          },
        },
      },
    },
  },
})

export default theme