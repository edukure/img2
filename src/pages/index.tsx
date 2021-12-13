import {
  Link as ChakraLink,
  Text,
  Image,
  Box,
  Stack,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useBoolean,
} from '@chakra-ui/react';

import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import ImageParser from 'react-image-parser';
import { contrastAndBrightness } from '../utils/processing';
import { getImgFromArr } from 'array-to-image';
import Histogram from '../components/Histogram';

const Index = () => {
  const [contrastValue, setContrastValue] = useState(1);
  const [brightnessValue, setBrightnessValue] = useState(0);
  const [showWithProcessing, setShowWithProcessing] = useBoolean(true);

  const [imageUrl, setImageUrl] = useState('');
  const [imageSize, setImageSize] =
    useState<{ width: number; height: number }>(null);
  const [originalImageData, setOriginalImageData] =
    useState<Uint8ClampedArray>();

  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [processedImageData, setProcessedImageData] =
    useState<Uint8ClampedArray>();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl);
      });

      reader.readAsDataURL(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: 'image/jpeg, image/png',
      onDrop,
    });

  const applyFilters = useCallback(
    (data) => {
      const result = contrastAndBrightness(data, {
        contrast: contrastValue,
        brightness: brightnessValue,
      });

      setProcessedImageData(result);
      setProcessedImageUrl(
        getImgFromArr(result, imageSize.width, imageSize.height).src
      );
    },
    [imageSize, contrastValue, brightnessValue]
  );

  const handleSliderChangeEnd = () => {
    if (!imageUrl) return;
    applyFilters(originalImageData);
  };

  useEffect(() => {
    if (originalImageData && imageSize) {
      applyFilters(originalImageData);
    }
  }, [originalImageData, imageSize]);

  const originalHistogramData = useMemo(() => {
    if (!originalImageData) return;
    const dataMap = {};

    for (let k = 0; k < 256; k++) {
      dataMap[k] = 0;
    }

    originalImageData.forEach((value) => {
      dataMap[value] += 1;
    });

    const keys = Object.keys(dataMap);
    const data = keys.map((key) => ({
      index: key,
      value: dataMap[key],
    }));

    return data;
  }, [originalImageData]);

  const processedHistogramData = useMemo(() => {
    if (!processedImageData) return;
    const dataMap = {};

    for (let k = 0; k < 256; k++) {
      dataMap[k] = 0;
    }

    processedImageData.forEach((value) => {
      dataMap[value] += 1;
    });

    const keys = Object.keys(dataMap);
    const data = keys.map((key) => ({
      index: key,
      value: dataMap[key],
    }));

    return data;
  }, [processedImageData]);

  const resetFilters = () => {
    setContrastValue(1);
    setBrightnessValue(0);
    setProcessedImageData(originalImageData);
    setProcessedImageUrl(
      getImgFromArr(originalImageData, imageSize.width, imageSize.height).src
    );
  };

  return (
    <Container minH="100vh">
      <Hero title="Contraste e Brilho em Imagens Médicas" />
      <Main>
        <Box
          {...getRootProps()}
          display="block"
          w="full"
          bg={isDragActive ? 'teal.500' : 'white'}
          color={isDragActive ? 'whiteAlpha.800' : 'blackAlpha.800'}
          rounded="lg"
          shadow={isDragActive ? 'inner' : 'lg'}
          py={4}
          px={8}
          textAlign="center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text lineHeight="10">
              Solte o arquivo <strong>aqui</strong>
            </Text>
          ) : (
            <>
              <Text>
                Arraste e solte as imagens aqui ou clique para selecionar os
                arquivos
              </Text>
              <Text as="em" fontWeight="200">
                (Somente *.jpeg e *.png serão aceitos)
              </Text>
            </>
          )}
        </Box>

        <Stack direction={{ base: 'column', md: 'row' }} maxW="container.md">
          <VStack
            py={4}
            px={2}
            rounded="lg"
            as="section"
            bg="white"
            w={{ base: 'full', md: 'sm' }}
            justifyContent="center"
            alignItems="center"
            shadow="lg"
          >
            {imageUrl ? (
              <>
                {showWithProcessing ? (
                  <Image
                    src={processedImageUrl}
                    maxW="sm"
                    fit="scale-down"
                    w="full"
                    maxH="300px"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    maxW="sm"
                    fit="scale-down"
                    w="full"
                    maxH="300px"
                  />
                )}

                <Text color="blackAlpha.800" fontSize={14}>
                  {(acceptedFiles && (acceptedFiles[0] as FileWithPath).path) ??
                    ''}
                </Text>

                <ImageParser
                  img={imageUrl}
                  key={imageUrl}
                  onImageParsed={({ data, size }) => {
                    setOriginalImageData(data);
                    setImageSize(size);
                  }}
                />
              </>
            ) : (
              <Image
                src="https://via.placeholder.com/300'"
                maxW="sm"
                fit="scale-down"
                w="full"
                h="full"
              />
            )}
          </VStack>

          <VStack
            as="section"
            w={{ base: 'full', md: 'sm' }}
            bg="white"
            py={4}
            px={8}
            rounded="lg"
            shadow="lg"
            flexGrow={1}
            spacing={8}
            justifyContent="center"
          >
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FormLabel
                as="h2"
                htmlFor="processamento"
                textTransform="uppercase"
              >
                processamento
              </FormLabel>
              <Switch
                colorScheme="teal"
                id="processamento"
                isChecked={showWithProcessing}
                onChange={setShowWithProcessing.toggle}
              />
            </FormControl>
            <VStack textAlign="center" w="full">
              <Heading as="h3" fontSize="lg" fontWeight="medium">
                contraste
              </Heading>
              <Slider
                colorScheme="teal"
                aria-label="slider-contraste"
                defaultValue={1}
                max={3}
                min={0}
                step={0.1}
                onChange={setContrastValue}
                onChangeEnd={handleSliderChangeEnd}
                value={contrastValue}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} bg="teal.500" position="relative">
                  <Text position="absolute" bottom={-6}>
                    {contrastValue}
                  </Text>
                </SliderThumb>
              </Slider>
            </VStack>

            <VStack textAlign="center" w="full" pb={4}>
              <Heading as="h3" fontSize="lg" fontWeight="medium">
                brilho
              </Heading>
              <Slider
                colorScheme="teal"
                aria-label="slider-brilho"
                defaultValue={0}
                max={255}
                min={-255}
                step={5}
                onChange={setBrightnessValue}
                onChangeEnd={handleSliderChangeEnd}
                value={brightnessValue}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} bg="teal.500" position="relative">
                  <Text position="absolute" bottom={-6}>
                    {brightnessValue}
                  </Text>
                </SliderThumb>
              </Slider>
            </VStack>

            <Button
              colorScheme="orange"
              size="md"
              fontWeight="normal"
              onClick={resetFilters}
            >
              Resetar
            </Button>
          </VStack>
        </Stack>
        {originalImageData && (
          <VStack
            display="block"
            w="full"
            bg="white"
            shadow="lg"
            rounded="lg"
            justifyContent="center"
            alignItems="center"
            h="350px"
            px={4}
            pb={20}
            pt={2}
            textAlign="center"
            spacing={8}
          >
            <Heading as="h2" fontSize="3xl" color="blackAlpha.800">
              Histograma
            </Heading>
            <Histogram
              data={
                showWithProcessing
                  ? processedHistogramData
                  : originalHistogramData
              }
            />
          </VStack>
        )}
      </Main>

      <Footer>
        <Text>Feito por Eduardo Tioma</Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default Index;
