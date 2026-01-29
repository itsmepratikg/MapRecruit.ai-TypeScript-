import React from 'react';
import { Copy } from '../../../components/Icons';
import { EmptyView } from '../../../components/Common';

export const Duplicates = () => {
    return (
        <EmptyView
            title="No Duplicate Profiles"
            message="We didn't find any potential duplicates for this candidate in the system."
            icon={Copy}
        />
    );
};

export default Duplicates;
