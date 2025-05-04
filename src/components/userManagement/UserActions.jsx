import React from 'react';
import { Button } from "@material-tailwind/react";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";

const UserActions = ({
    onAddUser,
    hasUserManagementPermission
}) => {
    return (
        <>
            <Button
                onClick={onAddUser}
                disabled={!hasUserManagementPermission}
                icon={<UserPlusIcon className="h-4 w-4" />}
            >
                Add User
            </Button>
        </>
    );
};

export default UserActions;