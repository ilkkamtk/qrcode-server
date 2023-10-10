interface User {
  id: string;
  location: {
    type: 'Point';
    coordinates: number[];
  };
}

export {User};
