function Obj = ObjFunQuad(X)
%define objective function. X(1) is p, X(2) is r

Obj = 0;


if (X(1).*(0.544*0.272-(0.272)^2))/X(2) > 1 
    % is the gradient at x=0.1 <= 0 (i.e: does not cross into central zone)
    
    Obj = Obj + 1e8*((X(1).*(0.544*0.272-(0.272)^2))/X(2) - 1).^2;
else
    Obj = 0 ;
end

noNodes = 100;
b = ones(1,noNodes); % initialise b

nodeLocations = linspace(0,0.297 - 0.025,100);

for i = 1:length(nodeLocations)

    if nodeLocations(i) < (-calcq(X(1),X(2)) - sqrt( ((calcq(X(1),X(2)))^2) - 4*X(1)*(X(2)-0.1))) /  (2*X(1))
        b(i) = 0.21; % set cut curve to 0.21 if the quadratic is > 0.21
    else
        b(i) = 2.*halfwidthQuad(X(1),X(2),nodeLocations(i)) + 0.01; 
        % find half-width from curve, then double and add exclusion zone

    end
end

Obj = Obj + beamBending(b);

end
