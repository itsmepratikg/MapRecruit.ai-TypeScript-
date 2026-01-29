import React from 'react';
import { Folder } from '../../../components/Icons';
import { EmptyView } from '../../../components/Common';

export const Folders = () => {
    return (
        <EmptyView
            title="No Linked Folders"
            message="This candidate hasn't been added to any folders yet."
            icon={Folder}
        />
    );
};

export default Folders;
