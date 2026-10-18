Drop folder for Stream Deck images (source art, not used by Stream Deck directly).

One square PNG per folder, at least 144x144 (bigger is fine), transparent background preferred.
Any file name works. Then ask Claude to "process the Stream Deck art".

  <action>/       -> that action's key image (72/144) and action list icon (20/40)
                     Optional: add a second file named list-icon.png for a different,
                     simpler list icon; otherwise the same image is used for both.
  _plugin/        -> plugin icon (256/512) and plugin category icon (28/56)
                     Optional: category-icon.png for a different category icon.
