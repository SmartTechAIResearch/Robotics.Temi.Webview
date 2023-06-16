import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useAppConfig } from '../hooks/useAppConfigAlt';

function ConfigPanel({isOpen, onClose}) {
  const [config, handleConfigChange, saveConfig] = useAppConfig();


  const handleSave = () => {
    console.log("Saving the config:", config);
    saveConfig();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Configure URLs</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="socketUri"
            label="Socket URI"
            type="url"
            value={config.socketUri}
            onChange={handleConfigChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="apiUri"
            label="API URI"
            type="url"
            value={config.apiUri}
            onChange={handleConfigChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="tour"
            label="Tour"
            value={config.tour}
            onChange={handleConfigChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfigPanel;
