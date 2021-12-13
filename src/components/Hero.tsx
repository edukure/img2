import { Flex, Heading } from '@chakra-ui/react';

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    bgGradient="linear(to-b, #49adaf, #196566)"
    bgClip="text"
    textAlign="center"
    pt="6"
  >
    <Heading fontSize="4vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: 'with-chakra-ui-typescript',
};
