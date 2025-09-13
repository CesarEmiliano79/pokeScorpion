export const Nosotros = (req, res) => {
  const locations = [
    { name: "CDMX", lat: 19.432608, lng: -99.133209 },
    { name: "Guadalajara", lat: 20.659699, lng: -103.349609 }
  ];
  res.json(locations); 
}