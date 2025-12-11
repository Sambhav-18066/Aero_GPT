
// Placeholder avatar using SVG/Lottie idea
export default function Avatar({ emotion }) {
  return (
    <div style={{ width: 150, height: 150, background: '#444', borderRadius: 20 }}>
      <p style={{ textAlign: 'center', paddingTop: 60 }}>Avatar: {emotion}</p>
    </div>
  );
}
