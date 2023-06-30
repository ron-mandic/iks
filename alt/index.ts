const stickySection = Array.from(document.querySelectorAll('.sticky'));
let images = [
  'https://images.unsplash.com/photo-1687822212421-beb67b06df0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  'https://images.unsplash.com/photo-1648461409140-8435a67cf24f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  'https://plus.unsplash.com/premium_photo-1675237625753-c01705e314bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  'https://images.unsplash.com/photo-1682687982107-14492010e05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
];

images.forEach((img) => {
  stickySection.forEach((section) => {
    let image = document.createElement('img');
    image.src = img;
    section.querySelector('.scroll_section')!.appendChild(image);
  });
});

window.addEventListener('scroll', () => {
  for (let i = 0; i < stickySection.length; i++) {
    transform(stickySection[i]);
  }
});

function transform(section: Element) {
  const offsetTop = section.parentElement!.offsetTop;
  const scrollSection = section.querySelector('.scroll_section');

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
  percentage = percentage < 0 ? 0 : percentage > 400 ? 400 : percentage;
  // @ts-ignore
  scrollSection!.style.transform = `translate3d(${-percentage}vw, 0, 0)`;
}
