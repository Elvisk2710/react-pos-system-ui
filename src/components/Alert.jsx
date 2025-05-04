import { Alert, Button } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import icons from '@/utils/icons';
const AlertPopUp = ({ message, alertOpen, type }) => {
    const [open, setOpen] = useState(alertOpen)
    let icon;
    let color;
    switch (type) {
        case "error":
            icon = icons.error
            color = "red";
            break;
        case "warning":
            icon = icons.warning
            color = "amber";
            break;
        case "success":
            icon = icons.success
            color = "green";
            break;
    }
    useEffect(() => {
        if (alertOpen == true) {
            setTimeout(() => {
                setOpen(false)
            }, 4000)
        }
        setOpen(alertOpen)
    }, [alertOpen])
    return (
        <Alert
            variant="gradient"
            open={open}
            animate={true}
            icon={icon}
            color={color}
            className='absolute top-5 w-[40%] right-[30%] left-[30%] m-0'
            // icon={icon}  
            action={
                <Button
                    variant="text"
                    color="white"
                    size="sm"
                    className="!absolute top-3 right-3"
                    onClick={() => setOpen(false)}
                >
                    Close
                </Button>
            }
        >
            {message}
        </Alert>
    )
}

export default AlertPopUp