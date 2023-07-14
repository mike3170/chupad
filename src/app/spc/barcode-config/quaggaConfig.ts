export let configQuagga = {
  inputStream: {
    name: 'Live',
    type: 'LiveStream',
    target: '#inputBarcode',

    constraints: {
      width: 700,
      height: 340,
      facingMode: 'environment',
      aspectRatio: { min: 1, max: 100 },
    },
    singleChannel: false // true: only the red color-channel is read
  },

  locator: {
    halfSample: true,
    patchSize: 'medium'
  },

  locate: true,
  numOfWorkers: 4,

  decoder: {
    readers: ['code_39_reader']
  }

};
