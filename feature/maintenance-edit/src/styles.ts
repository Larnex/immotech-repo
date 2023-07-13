export const styles = {
  imageButton: {
    borderStyle: 'dashed' as const,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden' as const,
  },

  image: {
    padding: 10,
    position: 'relative',
    zIndex: 10,
    borderRadius: 10,
  },

  imageDeleteBtn: {
    position: 'absolute',
    top: '6%',
    right: '20%',
    zIndex: 999,
    backgroundColor: 'white',
    borderRadius: 50,
  },
};
