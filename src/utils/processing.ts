const contrastAndBrightness = (
  array: Uint8ClampedArray,
  { contrast = 1, brightness = 0, bits = 8 }
): Uint8ClampedArray => {
  //g(x,y) = contrast * f(x,y) + brightness

  let result = array.map((value, index) => {
    let newValue = contrast * value + brightness;

    if (newValue < 0) {
      return 0;
    } else if (newValue > 255) {
      return 255;
    }

    return newValue;
  });

  return result;
};

export { contrastAndBrightness };
