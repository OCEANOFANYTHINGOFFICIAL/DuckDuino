/*- ---End of generated lib--- -*/
uint8_t USBPutChar(uint8_t c);

// press() adds the specified key (printing, non-printing, or modifier)
// to the persistent key report and sends the report.  Because of the way
// USB HID works, the host acts like the key remains pressed until we
// call release(), releaseAll(), or otherwise clear the report and resend.
size_t Keyboard_::press(uint8_t k)
{
  uint8_t i;
  if (k >= 136) {      // it's a non-printing key (not a modifier)
    k = k - 136;
  } else if (k >= 128) {  // it's a modifier key
    _keyReport.modifiers |= (1<<(k-128));
    k = 0;
  } else {        // it's a printing key
    int oldKey = k;
    k = pgm_read_byte(_asciimap + k);
    if (!k) {
      setWriteError();
      return 0;
    }
    if (k & 0x80) {            // it's a capital letter or other character reached with shift
      _keyReport.modifiers |= 0x02;  // the left shift modifier
      k &= 0x7F;
    }

    if (!_altFine)
      initAltGr();
    if (_altGrMap[oldKey])
      _keyReport.modifiers |= 0x40;
  }

  // Add k to the key report only if it's not already present
  // and if there is an empty slot.
  if (_keyReport.keys[0] != k && _keyReport.keys[1] != k &&
    _keyReport.keys[2] != k && _keyReport.keys[3] != k &&
    _keyReport.keys[4] != k && _keyReport.keys[5] != k) {

    for (i=0; i<6; i++) {
      if (_keyReport.keys[i] == 0x00) {
        _keyReport.keys[i] = k;
        break;
      }
    }
    if (i == 6) {
      setWriteError();
      return 0;
    }
  }
  sendReport(&_keyReport);
  return 1;
}

// release() takes the specified key out of the persistent key report and
// sends the report.  This tells the OS the key is no longer pressed and that
// it shouldn't be repeated any more.
size_t Keyboard_::release(uint8_t k)
{
  uint8_t i;
  if (k >= 136) {      // it's a non-printing key (not a modifier)
    k = k - 136;
  } else if (k >= 128) {  // it's a modifier key
    _keyReport.modifiers &= ~(1<<(k-128));
    k = 0;
  } else {        // it's a printing key
    int oldKey = k;
    k = pgm_read_byte(_asciimap + k);
    if (!k) {
      return 0;
    }
    if (k & 0x80) {              // it's a capital letter or other character reached with shift
      _keyReport.modifiers &= ~(0x02);  // the left shift modifier
      k &= 0x7F;
    }

    if (_altGrMap[oldKey])
      _keyReport.modifiers &= ~(0x40);
  }

  // Test the key report to see if k is present.  Clear it if it exists.
  // Check all positions in case the key is present more than once (which it shouldn't be)
  for (i=0; i<6; i++) {
    if (0 != k && _keyReport.keys[i] == k) {
      _keyReport.keys[i] = 0x00;
    }
  }

  sendReport(&_keyReport);
  return 1;
}

void Keyboard_::releaseAll(void)
{
  _keyReport.keys[0] = 0;
  _keyReport.keys[1] = 0;
  _keyReport.keys[2] = 0;
  _keyReport.keys[3] = 0;
  _keyReport.keys[4] = 0;
  _keyReport.keys[5] = 0;
  _keyReport.modifiers = 0;
  sendReport(&_keyReport);
}

size_t Keyboard_::write(uint8_t c)
{
  uint8_t p = press(c);  // Keydown
  release(c);            // Keyup
  return p;              // just return the result of press() since release() almost always returns 1
}

Keyboard_ Keyboard;

#endif
