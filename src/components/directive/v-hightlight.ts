const highlightText = (el: any, binding: any) => {
  const searchText = binding.value.trim().toLowerCase();
  const regex = new RegExp(searchText.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), 'giu');
  el.innerHTML = el.innerHTML.replace(/<mark>/gi, '').replace(/<\/mark>/gi, '');
  el.innerHTML = el.innerHTML.replace(regex, '<mark>$&</mark>');
};
export default {
  beforeMount(el: any, binding: any) {
    highlightText(el, binding);
  },
  updated(el: any, binding: any) {
    highlightText(el, binding);
  },
};
