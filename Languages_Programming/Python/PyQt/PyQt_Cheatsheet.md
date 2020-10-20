# PyQt Cheatsheet

## Empty Window

```Python
import sys
from PyQt5.QtWidgets import QApplication, QWidget

class EmptyWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setGeometry(100, 100, 400, 300)
        self.setWindowTitle('Empty Window in PyQt')
        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)  # or pass [] if no possible CLI args
    window = EmptyWindow()        # instantiate a window
    sys.exit(app.exec_())         # start the event loop
```
