export const formatter = {
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  },
};

export default formatter;
